import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateInvoiceHtml, generateReceiptHtml } from "@/lib/pdf";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const invoiceId = Number(params.id);
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "invoice";

  const invoice = await db.Invoice.query().where("id", "=", invoiceId).first();
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const ws = await db.Workspace.query().where("id", "=", invoice.workspaceId).first();
  const contact = await db.Contact.query().where("id", "=", invoice.contactId).first();

  const businessName = ws?.name || "Business";
  const customerName = contact ? `${contact.firstName} ${contact.lastName}` : "Customer";
  const customerEmail = (contact as any)?.email || "";

  if (type === "receipt") {
    const payment = await db.PaystackPayment.query()
      .where("invoiceId", "=", invoiceId)
      .where("workspaceId", "=", invoice.workspaceId)
      .where("status", "=", "success")
      .first();

    const html = generateReceiptHtml({
      receiptNumber: `RCP-${String(invoiceId).padStart(5, "0")}`,
      businessName,
      customerName,
      customerEmail,
      amount: Number(invoice.totalAmount),
      currency: "NGN",
      paidAt: invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : new Date().toLocaleDateString(),
      reference: payment?.reference || "",
      paymentMethod: "Paystack",
    });

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html", "Content-Disposition": `attachment; filename="receipt-${invoiceId}.html"` },
    });
  }

  const html = generateInvoiceHtml({
    invoiceNumber: invoice.invoiceNumber || `INV-${String(invoiceId).padStart(5, "0")}`,
    businessName,
    customerName,
    customerEmail,
    items: [{ description: "Invoice Items", quantity: 1, unitPrice: Number(invoice.totalAmount), total: Number(invoice.totalAmount) }],
    subtotal: Number(invoice.totalAmount),
    tax: 0,
    total: Number(invoice.totalAmount),
    currency: "NGN",
    status: invoice.status,
    dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "",
    paidAt: invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : undefined,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html", "Content-Disposition": `attachment; filename="invoice-${invoiceId}.html"` },
  });
}
