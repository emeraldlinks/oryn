import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const periodType = searchParams.get("periodType");
  const stats = searchParams.get("stats");

  return withDb(async (db) => {
    if (stats === "1") {
      const goals = await db.SalesGoal.query()
        .where("workspaceId", "=", wsId)
        .get();

      const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalAchieved = goals.reduce((sum, g) => sum + g.achievedAmount, 0);
      const averageProgress = goals.length > 0
        ? goals.reduce((sum, g) => sum + (g.targetAmount > 0 ? (g.achievedAmount / g.targetAmount) * 100 : 0), 0) / goals.length
        : 0;
      const onTrack = goals.filter((g) => g.targetAmount > 0 && (g.achievedAmount / g.targetAmount) >= 0.5).length;

      return NextResponse.json({
        totalTarget,
        totalAchieved,
        averageProgress: Math.round(averageProgress * 100) / 100,
        onTrack,
      });
    }

    let query = db.SalesGoal.query()
      .where("workspaceId", "=", wsId)
      .preload("user");

    if (userId) query = query.where("userId", "=", Number(userId));
    if (periodType) query = query.where("periodType", "=", periodType);

    const goals = await query.orderBy("createdAt", "DESC").get();
    const goalsWithProgress = goals.map((g) => ({
      ...g,
      progress: g.targetAmount > 0 ? Math.round((g.achievedAmount / g.targetAmount) * 10000) / 100 : 0,
    }));

    return NextResponse.json(goalsWithProgress);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  return withDb(async (db) => {
    const goal = await db.SalesGoal.insert({
      workspaceId: wsId,
      userId: Number(body.userId),
      targetAmount: body.targetAmount,
      period: body.period,
      periodType: body.periodType,
      currency: body.currency || "USD",
      achievedAmount: 0,
      startDate: body.startDate,
      endDate: body.endDate,
    });
    return NextResponse.json(goal, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    await db.SalesGoal.update({ id: Number(id), workspaceId: wsId }, data);
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const wsId = Number(session.user.workspaceId);
  return withDb(async (db) => {
    await db.SalesGoal.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
