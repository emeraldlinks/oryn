import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.KnowledgeArticle.query().where("workspaceId", "=", wsId);

  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const category = searchParams.get("category");
  if (category) {
    query = query.whereRaw('"categories"::text LIKE ?', [`%"${category}"%`]);
  }

  const search = searchParams.get("search");
  if (search) {
    const q = `%${search}%`;
    query = query.whereRaw(
      '(LOWER("title") LIKE LOWER(?) OR LOWER("bodyHtml") LIKE LOWER(?))',
      [q, q]
    );
  }

  const articles = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const body = await req.json();

  if (searchParams.has("feedback")) {
    const { id, helpful } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const wsId = Number(session.user.workspaceId);
    const article = await db.KnowledgeArticle.get({ id: Number(id), workspaceId: wsId });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (helpful) {
      await db.KnowledgeArticle.update({ id: Number(id) }, { helpfulCount: (article.helpfulCount || 0) + 1 });
    } else {
      await db.KnowledgeArticle.update({ id: Number(id) }, { notHelpfulCount: (article.notHelpfulCount || 0) + 1 });
    }
    return NextResponse.json({ success: true });
  }

  const article = await db.KnowledgeArticle.insert({
    title: body.title,
    bodyHtml: body.bodyHtml,
    categories: body.categories || null,
    tags: body.tags || null,
    status: body.status || "published",
    workspaceId: Number(session.user.workspaceId),
  });

  return NextResponse.json(article, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  await db.KnowledgeArticle.update(
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

  await db.KnowledgeArticle.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
