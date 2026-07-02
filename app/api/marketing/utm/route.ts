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

  let query = db.UTMLink.query().where("workspaceId", "=", wsId);

  const campaign = searchParams.get("campaign");
  if (campaign) query = query.where("campaign", "=", campaign);

  const search = searchParams.get("search");
  if (search) {
    query = query.whereRaw('(LOWER("sourceUrl") LIKE LOWER(?) OR LOWER("targetUrl") LIKE LOWER(?))', [`%${search}%`, `%${search}%`]);
  }

  const links = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const link = await db.UTMLink.insert({
    workspaceId: Number(session.user.workspaceId),
    sourceUrl: body.sourceUrl,
    targetUrl: body.targetUrl,
    campaign: body.campaign || null,
    source: body.source || null,
    medium: body.medium || null,
    content: body.content || null,
    term: body.term || null,
    clicks: 0,
  });

  return NextResponse.json(link, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.UTMLink.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
