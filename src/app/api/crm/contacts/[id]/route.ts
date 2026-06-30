import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const contactId = Number(params.id);

  const contact = await db.Contact.query()
    .preload("assignee")
    .preload("deals")
    .where("id", "=", contactId)
    .where("workspaceId", "=", wsId)
    .first();

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const [activities, tickets, messages, calls, meetings] = await Promise.all([
    db.Activity.query()
      .preload("user")
      .preload("deal")
      .where("contactId", "=", contactId)
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .limit(50)
      .get(),
    db.Ticket.query()
      .preload("assignee")
      .preload("messages")
      .where("contactId", "=", contactId)
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .get(),
    db.Message.query()
      .where("contactId", "=", contactId)
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .limit(50)
      .get(),
    db.Call.query()
      .preload("user")
      .where("contactId", "=", contactId)
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .limit(50)
      .get(),
    db.Meeting.query()
      .preload("user")
      .where("contactId", "=", contactId)
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .limit(50)
      .get(),
  ]);

  return NextResponse.json({
    contact,
    activities,
    tickets,
    messages,
    calls,
    meetings,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();
  const contactId = Number(params.id);
  const wsId = Number(session.user.workspaceId);

  await db.Contact.update({ id: contactId, workspaceId: wsId }, body);

  const updated = await db.Contact.query()
    .preload("assignee")
    .preload("deals")
    .where("id", "=", contactId)
    .first();

  return NextResponse.json(updated);
}
