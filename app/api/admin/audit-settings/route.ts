import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  let settings = await db.AuditSetting.query().where("workspaceId", "=", wsId).first();
  if (!settings) {
    settings = await db.AuditSetting.insert({ workspaceId: wsId });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  let settings = await db.AuditSetting.query().where("workspaceId", "=", wsId).first();
  if (settings) {
    await db.AuditSetting.update({ id: settings.id, workspaceId: wsId }, {
      ...(body.enabled !== undefined && { enabled: body.enabled }),
      ...(body.retentionDays !== undefined && { retentionDays: body.retentionDays }),
      ...(body.trackedEvents !== undefined && { trackedEvents: body.trackedEvents }),
      ...(body.excludedUsers !== undefined && { excludedUsers: body.excludedUsers }),
    });
  } else {
    settings = await db.AuditSetting.insert({
      workspaceId: wsId,
      enabled: body.enabled ?? true,
      retentionDays: body.retentionDays ?? 30,
      trackedEvents: body.trackedEvents || [],
      excludedUsers: body.excludedUsers || null,
    });
  }

  settings = await db.AuditSetting.query().where("workspaceId", "=", wsId).first();
  return NextResponse.json(settings);
}
