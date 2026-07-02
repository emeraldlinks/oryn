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
  const entityType = searchParams.get("entityType");

  let query = db.CustomFieldDef.query().where("workspaceId", "=", wsId);
  if (entityType) query = query.where("entityType", "=", entityType);

  const fields = await query.orderBy("sortOrder", "ASC").get();
  return NextResponse.json(fields);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const field = await db.CustomFieldDef.insert({
    ...body,
    workspaceId: Number(session.user.workspaceId),
    required: body.required || false,
    sortOrder: body.sortOrder || 0,
  });

  return NextResponse.json(field, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.CustomFieldDef.update(
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
  await db.CustomFieldDef.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
