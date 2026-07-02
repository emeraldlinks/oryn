import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const languagePackId = searchParams.get("languagePackId");
  const namespace = searchParams.get("namespace");
  const search = searchParams.get("search");

  const q = db.TranslationEntry.query().where("workspaceId", "=", wsId);
  if (languagePackId) q.where("languagePackId", "=", Number(languagePackId));
  if (namespace) q.where("namespace", "=", namespace);
  if (search) q.where("key", "ILIKE", `%${search}%`);
  q.orderBy("key", "ASC");

  const entries = await q.get();
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const entry = await db.TranslationEntry.insert({
    workspaceId: wsId,
    languagePackId: body.languagePackId,
    key: body.key,
    value: body.value,
    namespace: body.namespace || null,
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (fields.value !== undefined) data.value = fields.value;
  if (fields.approvedById !== undefined) data.approvedById = fields.approvedById;

  await db.TranslationEntry.update({ id: Number(id), workspaceId: wsId }, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.TranslationEntry.delete({ id: Number(id), workspaceId: wsId });
  return NextResponse.json({ success: true });
}
