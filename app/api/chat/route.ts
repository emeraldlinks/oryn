import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.ChatMessage.query().where("workspaceId", "=", wsId);
  const contactId = searchParams.get("contactId");
  if (contactId) query = query.where("contactId", "=", Number(contactId));

  const visitorId = searchParams.get("visitorId");
  if (visitorId) query = query.where("visitorId", "=", visitorId);

  const messages = await query.orderBy("createdAt", "ASC").limit(100).get();
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();

  let wsId = 1;
  if (session?.user) {
    wsId = Number(session.user.workspaceId);
  } else if (body.publicToken) {
    const settings = await db.LiveChatSettings.get({ id: 1 });
  }

  const msg = await db.ChatMessage.insert({
    workspaceId: wsId,
    visitorId: body.visitorId,
    visitorName: body.visitorName || "Visitor",
    visitorEmail: body.visitorEmail,
    contactId: body.contactId ? Number(body.contactId) : undefined,
    userId: session?.user ? Number(session.user.id) : undefined,
    body: body.body,
    sender: body.sender || "visitor",
  });

  return NextResponse.json(msg, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const wsId = Number(session.user.workspaceId);

  if (body.markAllRead) {
    await db.ChatMessage.updateMany(
      { workspaceId: wsId, readAt: null },
      { readAt: new Date().toISOString() }
    );
  } else if (body.id) {
    await db.ChatMessage.update(
      { id: Number(body.id), workspaceId: wsId },
      { readAt: new Date().toISOString() }
    );
  }

  return NextResponse.json({ success: true });
}
