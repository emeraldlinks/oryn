import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.SocialMention.query().where("workspaceId", "=", wsId);

  const platform = searchParams.get("platform");
  if (platform) query = query.where("platform", "=", platform);

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const search = searchParams.get("search");
  if (search) {
    query = query.whereRaw('LOWER("content") LIKE LOWER(?)', [`%${search}%`]);
  }

  const mentions = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(mentions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const mention = await db.SocialMention.insert({
    workspaceId: Number(session.user.workspaceId),
    platform: body.platform,
    authorName: body.authorName,
    authorAvatar: body.authorAvatar || null,
    content: body.content,
    postedAt: body.postedAt || null,
    sentiment: body.sentiment || null,
    postUrl: body.postUrl || null,
    status: "unread",
  });

  return NextResponse.json(mention, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status } = body;

  await db.SocialMention.update(
    { id: Number(id), workspaceId: Number(session.user.workspaceId) },
    { status }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.SocialMention.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
