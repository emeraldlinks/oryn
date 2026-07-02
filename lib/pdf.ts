export function generateInvoiceHtml(invoice: {
  invoiceNumber: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt?: string;
}): string {
  const rows = invoice.items.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.description}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${invoice.currency} ${item.unitPrice.toFixed(2)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${invoice.currency} ${item.total.toFixed(2)}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice ${invoice.invoiceNumber}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:40px;color:#1f2937">
  <div style="max-width:700px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;padding:40px">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:32px">
      <div>
        <h1 style="font-size:24px;margin:0;color:#111827">${invoice.businessName}</h1>
        <p style="color:#6b7280;margin:4px 0 0">Invoice</p>
      </div>
      <div style="text-align:right">
        <h2 style="font-size:18px;margin:0;color:#3b82f6">${invoice.invoiceNumber}</h2>
        <p style="color:#6b7280;margin:4px 0 0">Status: <span style="color:${invoice.status === "paid" ? "#10b981" : "#f59e0b"};font-weight:600">${invoice.status.toUpperCase()}</span></p>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #f3f4f6">
      <div>
        <p style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Bill To</p>
        <p style="margin:0;font-weight:600">${invoice.customerName}</p>
        <p style="margin:4px 0 0;color:#6b7280">${invoice.customerEmail}</p>
      </div>
      <div style="text-align:right">
        <p style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Due Date</p>
        <p style="margin:0;font-weight:600">${invoice.dueDate}</p>
        ${invoice.paidAt ? `<p style="margin:4px 0 0;color:#6b7280">Paid: ${invoice.paidAt}</p>` : ""}
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <thead>
        <tr style="background:#f9fafb">
          <th style="padding:10px 8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280">Item</th>
          <th style="padding:10px 8px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280">Qty</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280">Price</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="border-top:2px solid #f3f4f6;padding-top:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#6b7280">Subtotal</span><span>${invoice.currency} ${invoice.subtotal.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#6b7280">Tax</span><span>${invoice.currency} ${invoice.tax.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:700;margin-top:12px;padding-top:12px;border-top:2px solid #e5e7eb"><span>Total</span><span style="color:#3b82f6">${invoice.currency} ${invoice.total.toFixed(2)}</span></div>
    </div>
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af">
      <p style="margin:0">Thank you for your business!</p>
    </div>
  </div>
</body>
</html>`;
}

export function generateReceiptHtml(receipt: {
  receiptNumber: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paidAt: string;
  reference: string;
  paymentMethod: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Receipt ${receipt.receiptNumber}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:40px;color:#1f2937">
  <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;padding:40px;text-align:center">
    <div style="font-size:48px;margin-bottom:16px">&#10003;</div>
    <h1 style="font-size:24px;margin:0;color:#10b981">Payment Received</h1>
    <p style="color:#6b7280;margin:8px 0 24px">${receipt.businessName}</p>
    <div style="font-size:36px;font-weight:700;color:#111827;margin-bottom:32px">${receipt.currency} ${receipt.amount.toFixed(2)}</div>
    <div style="background:#f9fafb;border-radius:8px;padding:24px;text-align:left;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:#6b7280;font-size:14px">Receipt No.</span>
        <span style="font-weight:600;font-size:14px">${receipt.receiptNumber}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:#6b7280;font-size:14px">Customer</span>
        <span style="font-weight:600;font-size:14px">${receipt.customerName}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:#6b7280;font-size:14px">Email</span>
        <span style="font-weight:600;font-size:14px">${receipt.customerEmail}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:#6b7280;font-size:14px">Payment Method</span>
        <span style="font-weight:600;font-size:14px">${receipt.paymentMethod}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:#6b7280;font-size:14px">Reference</span>
        <span style="font-weight:600;font-size:14px;color:#3b82f6">${receipt.reference}</span>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="color:#6b7280;font-size:14px">Date</span>
        <span style="font-weight:600;font-size:14px">${receipt.paidAt}</span>
      </div>
    </div>
    <div style="font-size:12px;color:#9ca3af">Thank you for your payment!</div>
  </div>
</body>
</html>`;
}
