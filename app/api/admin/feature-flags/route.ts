import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const flags = await db.FeatureFlag.query()
    .where("workspaceId", "=", wsId)
    .orderBy("key", "ASC")
    .get();
  return NextResponse.json(flags);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const flag = await db.FeatureFlag.insert({
    workspaceId: wsId,
    key: body.key,
    enabled: body.enabled ?? false,
    description: body.description || null,
  });
  return NextResponse.json(flag, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  await db.FeatureFlag.update({ id: Number(id), workspaceId: wsId }, {
    ...(data.key !== undefined && { key: data.key }),
    ...(data.enabled !== undefined && { enabled: data.enabled }),
    ...(data.description !== undefined && { description: data.description }),
  });
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

  await db.FeatureFlag.delete({ id: Number(id), workspaceId: wsId });
  return NextResponse.json({ success: true });
}
