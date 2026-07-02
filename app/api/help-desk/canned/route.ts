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

  let query = db.CannedResponse.query().where("workspaceId", "=", wsId);

  const category = searchParams.get("category");
  if (category) query = query.where("category", "=", category);

  const search = searchParams.get("search");
  if (search) {
    const q = `%${search}%`;
    query = query.whereRaw(
      '(LOWER("title") LIKE LOWER(?) OR LOWER("bodyHtml") LIKE LOWER(?))',
      [q, q]
    );
  }

  const responses = await query.orderBy("title", "ASC").get();
  return NextResponse.json(responses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const response = await db.CannedResponse.insert({
    title: body.title,
    bodyHtml: body.bodyHtml,
    shortcuts: body.shortcuts || null,
    category: body.category || null,
    workspaceId: Number(session.user.workspaceId),
  });

  return NextResponse.json(response, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.CannedResponse.update(
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
  await db.CannedResponse.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
