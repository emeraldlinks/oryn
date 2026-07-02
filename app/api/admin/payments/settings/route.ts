import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/encrypt";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const gateway = await db.PaymentGateway.query()
    .where("workspaceId", "=", wsId)
    .where("provider", "=", "paystack")
    .first();

  if (!gateway) {
    return NextResponse.json({ provider: "paystack", active: false, publicKey: "", secretKey: "", webhookSecret: "" });
  }

  return NextResponse.json({
    provider: gateway.provider,
    active: gateway.active,
    isDefault: gateway.isDefault,
    publicKey: await decrypt(gateway.apiKey),
    secretKey: gateway.apiSecret ? await decrypt(gateway.apiSecret) : "",
    webhookSecret: gateway.webhookSecret ? await decrypt(gateway.webhookSecret) : "",
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const existing = await db.PaymentGateway.query()
    .where("workspaceId", "=", wsId)
    .where("provider", "=", "paystack")
    .first();

  const data: Record<string, any> = {
    provider: "paystack",
    workspaceId: wsId,
    active: body.active !== undefined ? body.active : true,
    isDefault: body.isDefault !== undefined ? body.isDefault : true,
  };

  if (body.publicKey) data.apiKey = await encrypt(body.publicKey);
  if (body.secretKey) data.apiSecret = await encrypt(body.secretKey);
  if (body.webhookSecret) data.webhookSecret = await encrypt(body.webhookSecret);

  if (existing) {
    await db.PaymentGateway.update({ id: existing.id, workspaceId: wsId }, data);
  } else {
    await db.PaymentGateway.insert(data);
  }

  return NextResponse.json({ success: true });
}
