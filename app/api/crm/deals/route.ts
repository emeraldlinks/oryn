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

  let query = db.Deal.query()
    .preload("contact")
    .preload("assignee")
    .where("workspaceId", "=", wsId);

  const stage = searchParams.get("stage");
  if (stage) query = query.where("stage", "=", stage);

  const assignedTo = searchParams.get("assignedTo");
  if (assignedTo) query = query.where("assignedTo", "=", Number(assignedTo));

  const search = searchParams.get("search");
  if (search) query = query.where("title", "ILIKE", `%${search}%`);

  const deals = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(deals);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const deal = await db.Deal.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
    currency: body.currency || "USD",
    probability: body.probability ?? 10,
  });

  return NextResponse.json(deal, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.Deal.update(
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
  await db.Deal.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
