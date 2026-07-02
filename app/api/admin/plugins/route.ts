import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const plugins = await db.Plugin.query()
    .where("workspaceId", "=", wsId)
    .orderBy("name", "ASC")
    .get();

  return NextResponse.json(plugins);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const plugin = await db.Plugin.insert({
    workspaceId: wsId,
    name: body.name,
    version: body.version,
    author: body.author || null,
    description: body.description || null,
    entryPoint: body.entryPoint || null,
    permissions: body.permissions || null,
  });

  return NextResponse.json(plugin, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (fields.name !== undefined) data.name = fields.name;
  if (fields.version !== undefined) data.version = fields.version;
  if (fields.enabled !== undefined) data.enabled = fields.enabled;
  if (fields.description !== undefined) data.description = fields.description;
  if (fields.entryPoint !== undefined) data.entryPoint = fields.entryPoint;
  if (fields.permissions !== undefined) data.permissions = fields.permissions;

  await db.Plugin.update({ id: Number(id), workspaceId: wsId }, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.Plugin.delete({ id: Number(id), workspaceId: wsId });
  return NextResponse.json({ success: true });
}
