import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const userId = Number(session.user.id);

  const syncs = await db.EmailSync.query()
    .where("workspaceId", "=", wsId)
    .where("userId", "=", userId)
    .get();

  return NextResponse.json(syncs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const userId = Number(session.user.id);

  const existing = await db.EmailSync.get({
    workspaceId: wsId,
    userId,
    provider: body.provider,
  });

  if (existing) {
    await db.EmailSync.update({ id: existing.id }, {
      accessToken: body.accessToken,
      refreshToken: body.refreshToken || undefined,
      expiresAt: body.expiresAt,
      email: body.email,
      lastSyncedAt: new Date().toISOString(),
      active: true,
    });
    return NextResponse.json({ success: true, id: existing.id });
  }

  const sync = await db.EmailSync.insert({
    workspaceId: wsId,
    userId,
    provider: body.provider,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken || undefined,
    expiresAt: body.expiresAt,
    email: body.email,
    lastSyncedAt: new Date().toISOString(),
    active: true,
  });

  return NextResponse.json(sync, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.EmailSync.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
