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

  let query = db.PushNotification.query().where("workspaceId", "=", wsId);

  const userId = searchParams.get("userId");
  if (userId) query = query.where("userId", "=", Number(userId));

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const notifications = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(notifications);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const now = new Date().toISOString();

  const notification = await db.PushNotification.insert({
    workspaceId: Number(session.user.workspaceId),
    userId: Number(body.userId),
    title: body.title,
    body: body.body,
    data: body.data || null,
    status: "sent",
    sentAt: now,
    readAt: null,
  });

  return NextResponse.json(notification, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.PushNotification.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
