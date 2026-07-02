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

  let query = db.LeadScoreRule.query().where("workspaceId", "=", wsId);

  const active = searchParams.get("active");
  if (active === "true") query = query.where("active", "=", true);
  else if (active === "false") query = query.where("active", "=", false);

  const rules = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(rules);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const rule = await db.LeadScoreRule.insert({
    workspaceId: Number(session.user.workspaceId),
    name: body.name,
    entityType: body.entityType,
    conditions: body.conditions || [],
    scoreValue: body.scoreValue,
    active: body.active ?? true,
  });

  return NextResponse.json(rule, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.LeadScoreRule.update(
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
  await db.LeadScoreRule.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
