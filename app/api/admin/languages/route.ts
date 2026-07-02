import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const langs = await db.LanguagePack.query()
    .where("workspaceId", "=", wsId)
    .orderBy("isDefault", "DESC")
    .orderBy("name", "ASC")
    .get();

  return NextResponse.json(langs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (body.isDefault) {
    await db.LanguagePack.updateMany({ workspaceId: wsId, isDefault: true }, { isDefault: false });
  }

  const lang = await db.LanguagePack.insert({
    workspaceId: wsId,
    locale: body.locale,
    name: body.name,
    nativeName: body.nativeName || null,
    isRtl: body.isRtl ?? false,
    isDefault: body.isDefault ?? false,
  });

  return NextResponse.json(lang, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  if (fields.isDefault) {
    await db.LanguagePack.updateMany({ workspaceId: wsId, isDefault: true }, { isDefault: false });
  }

  await db.LanguagePack.update({ id: Number(id), workspaceId: wsId }, fields);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.LanguagePack.delete({ id: Number(id), workspaceId: wsId });
  return NextResponse.json({ success: true });
}
