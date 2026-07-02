import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.WordpressPost.query()
    .preload("site")
    .join("wordpress_sites", "wordpress_posts.wordpressSiteId", "=", "wordpress_sites.id")
    .where("wordpress_sites.workspaceId", "=", wsId);

  const siteId = searchParams.get("wordpressSiteId");
  if (siteId) query = query.where("wordpress_posts.wordpressSiteId", "=", Number(siteId));

  const status = searchParams.get("status");
  if (status) query = query.where("wordpress_posts.status", "=", status);

  const posts = await query.orderBy("wordpress_posts.createdAt", "DESC").get();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const post = await db.WordpressPost.insert({
    ...body,
    status: body.status || "draft",
  });

  return NextResponse.json(post, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  await db.WordpressPost.update({ id: Number(id) }, data);

  return NextResponse.json({ success: true });
}
