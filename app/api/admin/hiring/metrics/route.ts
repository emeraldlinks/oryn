import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDefaultMetrics } from "@/lib/cv-scanner";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  let metrics = await db.HiringMetric.query()
    .where("workspaceId", "=", wsId)
    .orderBy("sortOrder", "ASC")
    .get();

  if (metrics.length === 0) {
    const defaults = getDefaultMetrics();
    for (const m of defaults) {
      await db.HiringMetric.insert({
        workspaceId: wsId, name: m.name, description: m.description,
        category: m.category, maxScore: m.maxScore, weight: m.weight,
        enabled: true, sortOrder: m.id,
      });
    }
    metrics = await db.HiringMetric.query()
      .where("workspaceId", "=", wsId)
      .orderBy("sortOrder", "ASC")
      .get();
  }

  return NextResponse.json(metrics);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { metrics } = body;
  if (!Array.isArray(metrics)) return NextResponse.json({ error: "metrics array required" }, { status: 400 });

  for (const m of metrics) {
    const existing = await db.HiringMetric.query()
      .where("id", "=", m.id)
      .where("workspaceId", "=", wsId)
      .first();
    if (existing) {
      await db.HiringMetric.update({ id: m.id, workspaceId: wsId }, {
        ...(m.name !== undefined && { name: m.name }),
        ...(m.description !== undefined && { description: m.description }),
        ...(m.maxScore !== undefined && { maxScore: m.maxScore }),
        ...(m.weight !== undefined && { weight: m.weight }),
        ...(m.enabled !== undefined && { enabled: m.enabled }),
        ...(m.sortOrder !== undefined && { sortOrder: m.sortOrder }),
      });
    }
  }

  return NextResponse.json({ success: true });
}
