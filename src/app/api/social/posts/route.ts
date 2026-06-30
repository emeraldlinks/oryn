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

  let query = db.SocialPost.query()
    .preload("account")
    .preload("replies")
    .where("workspaceId", "=", wsId);

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const accountId = searchParams.get("socialAccountId");
  if (accountId) query = query.where("socialAccountId", "=", Number(accountId));

  const posts = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const post = await db.SocialPost.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
    status: body.status || "draft",
  });

  return NextResponse.json(post, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.SocialPost.update(
    { id: Number(id), workspaceId: Number(session.user.workspaceId) },
    data
  );

  return NextResponse.json({ success: true });
}
