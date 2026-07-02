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

  let query = db.Activity.query()
    .preload("contact")
    .preload("deal")
    .preload("user")
    .where("workspaceId", "=", wsId);

  const contactId = searchParams.get("contactId");
  if (contactId) query = query.where("contactId", "=", Number(contactId));

  const dealId = searchParams.get("dealId");
  if (dealId) query = query.where("dealId", "=", Number(dealId));

  const userId = searchParams.get("userId");
  if (userId) query = query.where("userId", "=", Number(userId));

  const type = searchParams.get("type");
  if (type) query = query.where("type", "=", type);

  const activities = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const activity = await db.Activity.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
    userId: body.userId || Number(session.user.id),
  });

  return NextResponse.json(activity, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.Activity.update(
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
  await db.Activity.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
