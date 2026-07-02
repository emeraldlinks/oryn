import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) throw new Error("SMTP not configured");
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_HOST) return;
  try {
    const t = getTransporter();
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export function paymentReceiptEmail({
  customerName,
  businessName,
  amount,
  currency,
  reference,
  invoiceNumber,
  receiptUrl,
}: {
  customerName: string;
  businessName: string;
  amount: number;
  currency: string;
  reference: string;
  invoiceNumber: string;
  receiptUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px;color:#1f2937">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;padding:32px">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:48px;margin-bottom:8px">&#10003;</div>
      <h1 style="font-size:20px;margin:0;color:#10b981">Payment Received</h1>
    </div>
    <p style="margin-bottom:16px">Hi <strong>${customerName}</strong>,</p>
    <p style="margin-bottom:24px">Your payment of <strong style="font-size:18px">${currency} ${amount.toFixed(2)}</strong> to <strong>${businessName}</strong> was successful.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#6b7280">Reference</span><span style="font-family:monospace;font-size:13px">${reference}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#6b7280">Invoice</span><span>${invoiceNumber}</span></div>
      <div style="display:flex;justify-content:space-between"><span style="color:#6b7280">Amount</span><span style="font-weight:600">${currency} ${amount.toFixed(2)}</span></div>
    </div>
    <a href="${receiptUrl}" style="display:block;text-align:center;background:#3b82f6;color:#fff;text-decoration:none;padding:12px;border-radius:8px;font-weight:600">Download Receipt</a>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:24px">Thank you for your business!</p>
  </div>
</body>
</html>`;
}

export function paymentNotificationEmail({
  businessName,
  customerName,
  amount,
  currency,
  invoiceNumber,
}: {
  businessName: string;
  customerName: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px;color:#1f2937">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;padding:32px">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:48px;margin-bottom:8px">&#10003;</div>
      <h1 style="font-size:20px;margin:0;color:#10b981">New Payment Received</h1>
    </div>
    <p style="margin-bottom:16px">Hi <strong>${businessName}</strong>,</p>
    <p style="margin-bottom:24px">A payment of <strong style="font-size:18px">${currency} ${amount.toFixed(2)}</strong> was received from <strong>${customerName}</strong>.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#6b7280">Customer</span><span>${customerName}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#6b7280">Invoice</span><span>${invoiceNumber}</span></div>
      <div style="display:flex;justify-content:space-between"><span style="color:#6b7280">Amount</span><span style="font-weight:600">${currency} ${amount.toFixed(2)}</span></div>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af">View in your dashboard for full details.</p>
  </div>
</body>
</html>`;
}
