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
  const id = searchParams.get("id");
  const results = searchParams.get("results");

  if (id && results === "1") {
    const test = await db.ABTest.get({ id: Number(id), workspaceId: wsId });
    if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const variants = (test.variants as any[]) || [];
    const metrics = (test.metrics as any) || {};
    const totalImpressions = metrics.impressions || 0;
    const totalConversions = metrics.conversions || 0;

    const variantStats = variants.map((v: any) => {
      const imp = v.impressions || 0;
      const conv = v.conversions || 0;
      return {
        name: v.name,
        content: v.content,
        trafficPercent: v.trafficPercent,
        impressions: imp,
        conversions: conv,
        conversionRate: imp > 0 ? ((conv / imp) * 100).toFixed(2) : "0.00",
        lift: totalImpressions > 0
          ? ((conv / imp || 0) - (totalConversions / totalImpressions || 0)).toFixed(4)
          : "0.0000",
      };
    });

    return NextResponse.json({
      ...test,
      variantStats,
      overallConversionRate:
        totalImpressions > 0
          ? ((totalConversions / totalImpressions) * 100).toFixed(2)
          : "0.00",
    });
  }

  let query = db.ABTest.query().where("workspaceId", "=", wsId);
  const status = searchParams.get("status");
  if (status) query = query.where("status", "=", status);

  const tests = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(tests);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();

  const test = await db.ABTest.insert({
    workspaceId: Number(session.user.workspaceId),
    name: body.name,
    description: body.description || null,
    status: body.status || "draft",
    variants: body.variants || [],
    metrics: body.metrics || { impressions: 0, conversions: 0 },
    startedAt: null,
    completedAt: null,
    winner: null,
  });

  return NextResponse.json(test, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const now = new Date().toISOString();

  if (data.status === "running") {
    data.startedAt = now;
  }

  if (data.status === "completed") {
    data.completedAt = now;
    const test = await db.ABTest.get({ id: Number(id), workspaceId: wsId });
    if (test) {
      const metrics = data.metrics || test.metrics;
      const variants = test.variants as any[];
      if (metrics && variants?.length) {
        const m = metrics as any;
        const variantMetrics = variants.map((v: any) => ({
          name: v.name,
          rate: (v.impressions || 0) > 0
            ? ((v.conversions || 0) / (v.impressions || 1)) * 100
            : 0,
        }));
        const best = variantMetrics.reduce((a, b) => (a.rate > b.rate ? a : b));
        data.winner = { name: best.name, conversionRate: best.rate };
      }
    }
  }

  await db.ABTest.update(
    { id: Number(id), workspaceId: wsId },
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
  await db.ABTest.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
