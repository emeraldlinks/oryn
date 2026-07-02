import crypto from "crypto";
import { decrypt } from "./encrypt";

const PAYSTACK_API = "https://api.paystack.co";

export const PAYSTACK_IPS = [
  "52.31.139.75",
  "52.49.173.169",
  "52.214.14.220",
  "52.31.139.72",
  "52.49.173.168",
  "52.214.14.221",
  "52.31.139.76",
  "52.49.173.170",
  "52.214.14.222",
];

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function loadGateway(db: any, wsId: number) {
  const gateway = await db.PaymentGateway.query()
    .where("workspaceId", "=", wsId)
    .where("provider", "=", "paystack")
    .where("active", "=", true)
    .first();
  if (!gateway) throw new Error("Paystack not configured");
  const secretKey = await decrypt(gateway.apiSecret!);
  const webhookSecret = gateway.webhookSecret
    ? await decrypt(gateway.webhookSecret)
    : null;
  return { gateway, secretKey, webhookSecret };
}

export async function paystackGet(path: string, secretKey: string) {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  return res.json();
}

export async function paystackPost(path: string, secretKey: string, body: any) {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function generateReference(wsId: number, invoiceId: number): string {
  const rand = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `ORYN-${wsId}-${invoiceId}-${Date.now()}-${rand}`;
}
