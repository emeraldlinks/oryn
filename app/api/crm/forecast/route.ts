import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);

  const deals = await db.Deal.query()
    .preload("contact")
    .preload("assignee")
    .where("workspaceId", "=", wsId)
    .get();

  const stageValues: Record<string, { weight: number; count: number; total: number }> = {};
  let totalForecast = 0;
  let weightedForecast = 0;
  let wonTotal = 0;
  let lostTotal = 0;

  const stages = ["lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"];

  for (const stage of stages) {
    stageValues[stage] = { weight: 0, count: 0, total: 0 };
  }

  const stageWeights: Record<string, number> = {
    lead: 0.1,
    qualified: 0.3,
    proposal: 0.5,
    negotiation: 0.8,
    "closed-won": 1.0,
    "closed-lost": 0,
  };

  for (const deal of deals as any[]) {
    const stage = deal.stage;
    if (!stageValues[stage]) continue;

    stageValues[stage].count++;
    stageValues[stage].total += deal.value;
    totalForecast += deal.value;
    weightedForecast += deal.value * (stageWeights[stage] || 0);

    if (stage === "closed-won") wonTotal += deal.value;
    if (stage === "closed-lost") lostTotal += deal.value;
  }

  const byAssignee: Record<string, { count: number; value: number; won: number }> = {};
  for (const deal of deals as any[]) {
    const name = deal.assignee
      ? `${deal.assignee.firstName || ""} ${deal.assignee.lastName || ""}`.trim() || "Unassigned"
      : "Unassigned";
    if (!byAssignee[name]) byAssignee[name] = { count: 0, value: 0, won: 0 };
    byAssignee[name].count++;
    byAssignee[name].value += deal.value;
    if (deal.stage === "closed-won") byAssignee[name].won += deal.value;
  }

  const totalDeals = deals.length;
  const winRate = totalDeals > 0 ? ((stageValues["closed-won"]?.count || 0) / totalDeals) * 100 : 0;

  return NextResponse.json({
    stages: stageValues,
    stageWeights,
    totalForecast,
    weightedForecast,
    wonTotal,
    lostTotal,
    winRate: Math.round(winRate * 10) / 10,
    totalDeals,
    byAssignee,
  });
}
