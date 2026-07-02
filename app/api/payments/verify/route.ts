import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadGateway, paystackGet } from "@/lib/paystack";
import { sendEmail, paymentReceiptEmail, paymentNotificationEmail } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) return NextResponse.json({ error: "Reference required" }, { status: 400 });

  const payment = await db.PaystackPayment.query().where("reference", "=", reference).first();
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  if (payment.status === "success") {
    return NextResponse.json({ status: "success", payment });
  }

  const wsId = payment.workspaceId;

  let gw;
  try {
    gw = await loadGateway(db, wsId);
  } catch {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 400 });
  }

  const verifyData = await paystackGet(`/transaction/verify/${encodeURIComponent(reference)}`, gw.secretKey);

  if (!verifyData.status) {
    return NextResponse.json({ error: verifyData.message || "Verification failed" }, { status: 400 });
  }

  const txData = verifyData.data;
  const txStatus = txData.status;

  if (txStatus === "success") {
    const paidAmount = txData.amount / 100;
    if (Math.abs(paidAmount - (payment.amount || 0)) > 1) {
      await db.PaystackPayment.update(
        { id: payment.id!, workspaceId: wsId },
        { status: "failed", gatewayResponse: JSON.stringify({ ...txData, reason: "amount_mismatch" }) }
      );
      return NextResponse.json({ status: "failed", reason: "amount_mismatch" }, { status: 409 });
    }

    const invoice = await db.Invoice.query()
      .where("id", "=", payment.invoiceId)
      .where("workspaceId", "=", wsId)
      .first();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

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

    const contact = await db.Contact.query().where("id", "=", invoice.contactId).first();
    const workspace = await db.Workspace.query().where("id", "=", wsId).first();

    const receiptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/invoice/${payment.invoiceId}/pdf?type=receipt`;

    if (contact) {
      const customerEmail = (contact as any).email || (contact as any).Email || "";
      if (customerEmail) {
        await sendEmail({
          to: customerEmail,
          subject: `Payment Receipt - ${invoice.invoiceNumber || `INV-${payment.invoiceId}`}`,
          html: paymentReceiptEmail({
            customerName: `${contact.firstName} ${contact.lastName}`,
            businessName: workspace?.name || "Business",
            amount: paidAmount,
            currency: txData.currency || "NGN",
            reference,
            invoiceNumber: invoice.invoiceNumber || `INV-${payment.invoiceId}`,
            receiptUrl,
          }),
        });
      }
    }

    const workspaceEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    if (workspaceEmail && contact) {
      await sendEmail({
        to: workspaceEmail,
        subject: `Payment Received - ${invoice.invoiceNumber || `INV-${payment.invoiceId}`}`,
        html: paymentNotificationEmail({
          businessName: workspace?.name || "Business",
          customerName: contact ? `${contact.firstName} ${contact.lastName}` : "Customer",
          amount: paidAmount,
          currency: txData.currency || "NGN",
          invoiceNumber: invoice.invoiceNumber || `INV-${payment.invoiceId}`,
        }),
      });
    }

    const updated = await db.PaystackPayment.query().where("id", "=", payment.id!).first();
    return NextResponse.json({ status: "success", payment: updated });
  }

  if (txStatus === "failed" || txStatus === "abandoned") {
    await db.PaystackPayment.update(
      { id: payment.id!, workspaceId: wsId },
      { status: txStatus, gatewayResponse: JSON.stringify(txData) }
    );
  }

  return NextResponse.json({ status: txStatus || "failed", payment });
}
