import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadGateway, paystackPost, generateReference } from "@/lib/paystack";

export async function POST(req: Request) {
  const body = await req.json();
  const { invoiceId, email } = body;

  if (!invoiceId || !email) {
    return NextResponse.json({ error: "invoiceId and email are required" }, { status: 400 });
  }

  const invoice = await db.Invoice.query().where("id", "=", Number(invoiceId)).first();
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  if (invoice.status === "paid") {
    return NextResponse.json({ error: "Invoice is already paid" }, { status: 409 });
  }

  const wsId = invoice.workspaceId;

  let gw;
  try {
    gw = await loadGateway(db, wsId);
  } catch {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 400 });
  }

  const amount = Number(invoice.totalAmount);
  if (amount <= 0) {
    return NextResponse.json({ error: "Invalid invoice amount" }, { status: 400 });
  }

  const amountInKobo = Math.round(amount * 100);
  const ref = generateReference(wsId, Number(invoiceId));

  const paystackData = await paystackPost("/transaction/initialize", gw.secretKey, {
    email: email.trim().toLowerCase(),
    amount: amountInKobo,
    reference: ref,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/${invoiceId}?reference=${ref}`,
    metadata: {
      workspaceId: wsId,
      invoiceId: Number(invoiceId),
      invoiceNumber: invoice.invoiceNumber,
      amount,
    },
  });

  if (!paystackData.status) {
    return NextResponse.json({ error: paystackData.message || "Payment initialization failed" }, { status: 400 });
  }

  await db.PaystackPayment.insert({
    workspaceId: wsId,
    invoiceId: Number(invoiceId),
    reference: ref,
    accessCode: paystackData.data.access_code,
    status: "pending",
    amount,
    currency: "NGN",
    authorizationUrl: paystackData.data.authorization_url,
  });

  return NextResponse.json({
    authorizationUrl: paystackData.data.authorization_url,
    reference: ref,
    accessCode: paystackData.data.access_code,
  });
}
