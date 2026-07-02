import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  const pageId = searchParams.get("pageId");
  if (pageId) {
    const config = await db.SEOConfig.get({ pageId: Number(pageId), workspaceId: wsId });
    if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(config);
  }

  const list = searchParams.get("list");
  if (list === "1") {
    const configs = await db.SEOConfig.query().where("workspaceId", "=", wsId).orderBy("createdAt", "DESC").get();
    return NextResponse.json(configs);
  }

  return NextResponse.json([]);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const wsId = Number(session.user.workspaceId);

  const existing = await db.SEOConfig.get({ pageId: Number(body.pageId), workspaceId: wsId });

  if (existing) {
    await db.SEOConfig.update(
      { id: existing.id, workspaceId: wsId },
      {
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords,
        ogImageUrl: body.ogImageUrl,
        canonicalUrl: body.canonicalUrl,
        noIndex: body.noIndex,
        structuredData: body.structuredData,
      }
    );
    return NextResponse.json({ success: true });
  }

  const config = await db.SEOConfig.insert({
    workspaceId: wsId,
    pageId: Number(body.pageId),
    metaTitle: body.metaTitle || null,
    metaDescription: body.metaDescription || null,
    keywords: body.keywords || null,
    ogImageUrl: body.ogImageUrl || null,
    canonicalUrl: body.canonicalUrl || null,
    noIndex: body.noIndex || false,
    structuredData: body.structuredData || null,
  });

  return NextResponse.json(config, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.SEOConfig.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
