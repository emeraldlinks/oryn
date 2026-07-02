import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadGateway, PAYSTACK_IPS, verifyWebhookSignature } from "@/lib/paystack";
import { sendEmail, paymentReceiptEmail, paymentNotificationEmail } from "@/lib/email";

function getClientIP(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

export async function POST(req: Request) {
  const clientIp = getClientIP(req);
  if (clientIp && !PAYSTACK_IPS.includes(clientIp)) {
    return NextResponse.json({ received: true });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, data } = body;
  if (!event || !data) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (event !== "charge.success") return NextResponse.json({ received: true });

  const reference = data.reference;
  if (!reference) return NextResponse.json({ error: "No reference" }, { status: 400 });


  const payment = await db.PaystackPayment.query().where("reference", "=", reference).first();
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  if (payment.status === "success") return NextResponse.json({ received: true });

  const wsId = payment.workspaceId;

  let gw;
  try {
    gw = await loadGateway(db, wsId);
  } catch {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 400 });
  }

  if (gw.webhookSecret) {
    const valid = await verifyWebhookSignature(rawBody, signature, gw.webhookSecret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
  }

  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${gw.secretKey}` } }
  );
  const verifyData = await verifyRes.json();

  if (verifyData.status && verifyData.data.status === "success") {
    const txData = verifyData.data;
    const paidAmount = txData.amount / 100;
    const now = new Date().toISOString();

    if (payment.amount && Math.abs(paidAmount - payment.amount) > 1) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 409 });
    }

    await db.PaystackPayment.update(
      { id: payment.id!, workspaceId: wsId },
      {
        status: "success",
        paidAt: now,
        amount: paidAmount,
        currency: txData.currency || "NGN",
        gatewayResponse: JSON.stringify(txData),
      }
    );

    await db.Invoice.update(
      { id: payment.invoiceId, workspaceId: wsId },
      { status: "paid", paidAt: now }
    );

    const invoice = await db.Invoice.query().where("id", "=", payment.invoiceId).first();
    const contact = invoice ? await db.Contact.query().where("id", "=", invoice.contactId).first() : null;
    const workspace = await db.Workspace.query().where("id", "=", wsId).first();

    const receiptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/invoice/${payment.invoiceId}/pdf?type=receipt`;

    if (contact) {
      const customerEmail = (contact as any).email || (contact as any).Email || "";
      if (customerEmail) {
        await sendEmail({
          to: customerEmail,
          subject: `Payment Receipt - ${invoice?.invoiceNumber || `INV-${payment.invoiceId}`}`,
          html: paymentReceiptEmail({
            customerName: `${contact.firstName} ${contact.lastName}`,
            businessName: workspace?.name || "Business",
            amount: paidAmount,
            currency: txData.currency || "NGN",
            reference,
            invoiceNumber: invoice?.invoiceNumber || `INV-${payment.invoiceId}`,
            receiptUrl,
          }),
        });
      }
    }

    const workspaceEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    if (workspaceEmail && contact) {
      await sendEmail({
        to: workspaceEmail,
        subject: `Payment Received - ${invoice?.invoiceNumber || `INV-${payment.invoiceId}`}`,
        html: paymentNotificationEmail({
          businessName: workspace?.name || "Business",
          customerName: contact ? `${contact.firstName} ${contact.lastName}` : "Customer",
          amount: paidAmount,
          currency: txData.currency || "NGN",
          invoiceNumber: invoice?.invoiceNumber || `INV-${payment.invoiceId}`,
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
