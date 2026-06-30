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

  let query = db.Ticket.query()
    .preload("contact")
    .preload("assignee")
    .preload("messages")
    .where("workspaceId", "=", wsId);

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const priority = searchParams.get("priority");
  if (priority) query = query.where("priority", "=", priority);

  const assignedTo = searchParams.get("assignedTo");
  if (assignedTo) query = query.where("assignedTo", "=", Number(assignedTo));

  const tickets = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const ticket = await db.Ticket.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
    status: body.status || "open",
    priority: body.priority || "medium",
  });

  return NextResponse.json(ticket, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.Ticket.update(
    { id: Number(id), workspaceId: Number(session.user.workspaceId) },
    data
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.Ticket.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
