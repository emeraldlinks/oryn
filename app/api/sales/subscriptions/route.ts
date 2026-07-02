import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");
  const status = searchParams.get("status");
  const plans = searchParams.get("plans");

  return withDb(async (db) => {
    if (plans === "1") {
      const subscriptionPlans = await db.SubscriptionPlan.query()
        .where("workspaceId", "=", wsId)
        .preload("subscriptions")
        .orderBy("name", "ASC")
        .get();

      const plansWithCount = subscriptionPlans.map((p) => ({
        ...p,
        subscriptionCount: p.subscriptions ? p.subscriptions.length : 0,
      }));

      return NextResponse.json(plansWithCount);
    }

    let query = db.Subscription.query()
      .where("workspaceId", "=", wsId)
      .preload("contact")
      .preload("plan")
      .preload("invoices");

    if (contactId) query = query.where("contactId", "=", Number(contactId));
    if (status) query = query.where("status", "=", status);

    const subscriptions = await query.orderBy("createdAt", "DESC").get();
    return NextResponse.json(subscriptions);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const plans = searchParams.get("plans");
  const body = await req.json();

  return withDb(async (db) => {
    if (plans === "1") {
      const plan = await db.SubscriptionPlan.insert({
        workspaceId: wsId,
        name: body.name,
        description: body.description,
        price: body.price,
        currency: body.currency || "USD",
        billingCycle: body.billingCycle,
        features: body.features || null,
        active: true,
      });
      return NextResponse.json(plan, { status: 201 });
    }

    const subscription = await db.Subscription.insert({
      workspaceId: wsId,
      contactId: Number(body.contactId),
      planId: Number(body.planId),
      startDate: body.startDate,
      endDate: body.endDate,
      amount: body.amount ?? 0,
      currency: body.currency || "USD",
      status: "active",
    });

    return NextResponse.json(subscription, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const plans = searchParams.get("plans");
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    if (plans === "1") {
      await db.SubscriptionPlan.update({ id: Number(id), workspaceId: wsId }, data);
      return NextResponse.json({ success: true });
    }

    const updateData: any = { ...data };
    if (data.status === "cancelled") {
      updateData.cancelledAt = new Date().toISOString();
    }
    await db.Subscription.update({ id: Number(id), workspaceId: wsId }, updateData);
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
    await db.Subscription.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
