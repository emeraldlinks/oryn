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
  const metric = searchParams.get("metric");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = Math.min(Number(searchParams.get("limit")) || 500, 1000);

  let query = db.SystemHealthMetric.query().where("workspaceId", "=", wsId);
  if (metric) {
    const metrics = metric.split(",").map((m) => m.trim());
    query = query.where("metric", "IN", metrics);
  }
  if (from) query = query.where("recordedAt", ">=", from);
  if (to) query = query.where("recordedAt", "<=", to);

  const records = await query.orderBy("recordedAt", "DESC").limit(limit).get();
  return NextResponse.json(records);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const record = await db.SystemHealthMetric.insert({
    workspaceId: wsId,
    metric: body.metric,
    value: body.value,
    unit: body.unit || null,
    tags: body.tags || null,
    recordedAt: new Date().toISOString(),
  });
  return NextResponse.json(record, { status: 201 });
}
