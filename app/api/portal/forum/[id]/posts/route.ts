import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const topicId = Number(params.id);

  const posts = await db.ForumPost.query()
    .preload("author")
    .where("topicId", "=", topicId)
    .orderBy("createdAt", "ASC")
    .get();

  return NextResponse.json(posts);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const topicId = Number(params.id);

  const post = await db.ForumPost.insert({
    topicId,
    bodyHtml: body.bodyHtml,
    authorId: Number(session.user.id),
  });

  await db.ForumTopic.update(
    { id: topicId },
    { lastActivityAt: new Date().toISOString() }
  );

  return NextResponse.json(post, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, isSolution } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.ForumPost.update(
    { id: Number(id) },
    { isSolution }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.ForumPost.delete({ id: Number(id) });

  return NextResponse.json({ success: true });
}
