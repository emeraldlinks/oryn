import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const policies = await db.DataRetentionPolicy.query()
    .where("workspaceId", "=", wsId)
    .get();
  return NextResponse.json(policies);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const policy = await db.DataRetentionPolicy.insert({
    workspaceId: wsId,
    entityType: body.entityType,
    retentionDays: body.retentionDays,
    action: body.action,
  });
  return NextResponse.json(policy, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  await db.DataRetentionPolicy.update({ id: Number(id), workspaceId: wsId }, {
    ...(data.entityType !== undefined && { entityType: data.entityType }),
    ...(data.retentionDays !== undefined && { retentionDays: data.retentionDays }),
    ...(data.action !== undefined && { action: data.action }),
    ...(data.active !== undefined && { active: data.active }),
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.DataRetentionPolicy.delete({ id: Number(id), workspaceId: wsId });
  return NextResponse.json({ success: true });
}
