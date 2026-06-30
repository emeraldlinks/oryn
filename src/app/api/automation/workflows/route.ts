import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const logs = await db.AuditLog.query()
    .preload("user")
    .where("workspaceId", "=", wsId)
    .where("entity", "=", "workflow")
    .orderBy("createdAt", "DESC")
    .get();

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const log = await db.AuditLog.insert({
    workspaceId: Number(session.user.workspaceId),
    userId: Number(session.user.id),
    action: "workflow_created",
    entity: "workflow",
    meta: body,
  });

  return NextResponse.json(log, { status: 201 });
}
