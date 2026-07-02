import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.ForumTopic.query()
    .preload("author")
    .where("workspaceId", "=", wsId);

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const pinned = searchParams.get("pinned");
  if (pinned) query = query.where("pinned", "=", pinned === "true");

  const topics = await query
    .orderBy("pinned", "DESC")
    .orderBy("lastActivityAt", "DESC")
    .get();
  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const wsId = Number(session.user.workspaceId);
  const now = new Date().toISOString();

  const topic = await db.ForumTopic.insert({
    title: body.title,
    authorId: Number(session.user.id),
    lastActivityAt: now,
    workspaceId: wsId,
  });

  await db.ForumPost.insert({
    topicId: topic.id,
    bodyHtml: body.bodyHtml,
    authorId: Number(session.user.id),
  });

  return NextResponse.json(topic, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  await db.ForumTopic.update(
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

  await db.ForumTopic.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
