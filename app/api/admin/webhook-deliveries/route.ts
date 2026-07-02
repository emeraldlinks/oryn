import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const endpointId = searchParams.get("endpointId");
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);

  let query = db.WebhookDelivery.query().where("workspaceId", "=", wsId);
  if (status) query = query.where("status", "=", status);
  if (endpointId) query = query.where("endpointId", "=", Number(endpointId));

  const deliveries = await query.orderBy("createdAt", "DESC").limit(limit).get();
  return NextResponse.json(deliveries);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.WebhookDelivery.delete({ id: Number(id), workspaceId: wsId });
  return NextResponse.json({ success: true });
}
