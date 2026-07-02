import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.Contact.query()
    .preload("assignee")
    .preload("deals")
    .where("workspaceId", "=", wsId);

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const assignedTo = searchParams.get("assignedTo");
  if (assignedTo) query = query.where("assignedTo", "=", Number(assignedTo));

  const search = searchParams.get("search");
  if (search) {
    const q = `%${search}%`;
    query = query.whereRaw(
      '(LOWER("firstName" || \' \' || "lastName") LIKE LOWER(?) OR LOWER("email") LIKE LOWER(?) OR LOWER("company") LIKE LOWER(?))',
      [q, q, q]
    );
  }

  const contacts = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const contact = await db.Contact.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
  });

  return NextResponse.json(contact, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  await db.Contact.update(
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

  await db.Contact.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
