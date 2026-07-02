import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active");
  const earnings = searchParams.get("earnings");
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  return withDb(async (db) => {
    if (earnings === "1") {
      if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

      let query = db.CommissionEarning.query()
        .where("workspaceId", "=", wsId)
        .where("userId", "=", Number(userId))
        .preload("deal")
        .preload("plan");

      if (status) query = query.where("status", "=", status);

      const earnings = await query.orderBy("createdAt", "DESC").get();
      return NextResponse.json(earnings);
    }

    let query = db.CommissionPlan.query().where("workspaceId", "=", wsId);
    if (active === "true") {
      query = query.where("active", "=", true);
    }
    const plans = await query.orderBy("name", "ASC").get();
    return NextResponse.json(plans);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const calculate = searchParams.get("calculate");
  const body = await req.json();

  return withDb(async (db) => {
    if (calculate === "1") {
      const { dealId, userId, planId, dealAmount } = body;
      if (!dealId || !userId || !planId || dealAmount == null) {
        return NextResponse.json({ error: "dealId, userId, planId, and dealAmount required" }, { status: 400 });
      }

      const plan = await db.CommissionPlan.get({ id: Number(planId), workspaceId: wsId });
      if (!plan) return NextResponse.json({ error: "Commission plan not found" }, { status: 404 });

      let commissionAmount = 0;

      if (plan.tiers && Array.isArray(plan.tiers) && plan.tiers.length > 0) {
        const matchedTier = plan.tiers.find(
          (t: any) => dealAmount >= t.minAmount && dealAmount <= t.maxAmount
        );
        if (matchedTier) {
          commissionAmount = plan.rateType === "percentage"
            ? dealAmount * (matchedTier.rate / 100)
            : matchedTier.rate;
        }
      } else {
        commissionAmount = plan.rateType === "percentage"
          ? dealAmount * (plan.rateValue / 100)
          : plan.rateValue;
      }

      const earning = await db.CommissionEarning.insert({
        workspaceId: wsId,
        userId: Number(userId),
        dealId: Number(dealId),
        planId: Number(planId),
        amount: commissionAmount,
        status: "pending",
      });

      return NextResponse.json(earning, { status: 201 });
    }

    const plan = await db.CommissionPlan.insert({
      workspaceId: wsId,
      name: body.name,
      rateType: body.rateType,
      rateValue: body.rateValue,
      minDealValue: body.minDealValue,
      maxDealValue: body.maxDealValue,
      tiers: body.tiers || null,
      active: true,
    });
    return NextResponse.json(plan, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    await db.CommissionPlan.update({ id: Number(id), workspaceId: wsId }, data);
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
    await db.CommissionPlan.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
