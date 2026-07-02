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

  let query = db.Meeting.query()
    .preload("contact")
    .preload("deal")
    .preload("user")
    .where("workspaceId", "=", wsId);

  const contactId = searchParams.get("contactId");
  if (contactId) query = query.where("contactId", "=", Number(contactId));

  const userId = searchParams.get("userId");
  if (userId) query = query.where("userId", "=", Number(userId));

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const meetings = await query.orderBy("scheduledAt", "ASC").get();
  return NextResponse.json(meetings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const meeting = await db.Meeting.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
    userId: body.userId || Number(session.user.id),
    status: body.status || "scheduled",
  });

  return NextResponse.json(meeting, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.Meeting.update(
    { id: Number(id), workspaceId: Number(session.user.workspaceId) },
    data
  );

  return NextResponse.json({ success: true });
}
