import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const userId = Number(session.user.id);

  const notifications = await db.Notification.query()
    .where("workspaceId", "=", wsId)
    .where("userId", "=", userId)
    .orderBy("createdAt", "DESC")
    .limit(50)
    .get();

  return NextResponse.json(notifications);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const notification = await db.Notification.insert({
    workspaceId: Number(session.user.workspaceId),
    userId: body.userId || Number(session.user.id),
    type: body.type || "info",
    title: body.title,
    body: body.body || "",
    meta: body.meta || null,
  });

  return NextResponse.json(notification, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  if (body.all) {
    await db.Notification.updateMany(
      {
        workspaceId: Number(session.user.workspaceId),
        userId: Number(session.user.id),
        readAt: null,
      },
      { readAt: new Date().toISOString() }
    );
  } else if (body.id) {
    await db.Notification.update(
      {
        id: Number(body.id),
        workspaceId: Number(session.user.workspaceId),
        userId: Number(session.user.id),
      },
      { readAt: new Date().toISOString() }
    );
  }

  return NextResponse.json({ success: true });
}
