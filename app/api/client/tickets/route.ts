import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const contact = await db.Contact.query().where("workspaceId", "=", wsId).where("email", "=", session.user.email).first();
  if (!contact) return NextResponse.json([]);
  const tickets = await db.Ticket.query().where("workspaceId", "=", wsId).where("contactId", "=", contact.id).orderBy("createdAt", "DESC").get();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const contact = await db.Contact.query().where("workspaceId", "=", wsId).where("email", "=", session.user.email).first();
  if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  const json = await req.json();
  const ticket = await db.Ticket.insert({
    workspaceId: wsId,
    contactId: contact.id,
    subject: json.subject,
    status: "open",
    priority: "medium",
  });
  return NextResponse.json(ticket, { status: 201 });
}
