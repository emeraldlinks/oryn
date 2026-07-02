import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const workspace = await db.Workspace.query().where("id", "=", wsId).first();
  const subscriptions = await db.Subscription.query().where("workspaceId", "=", wsId).get();
  const plans = await db.SubscriptionPlan.query().where("workspaceId", "=", wsId).get();
  const invoices = await db.Invoice.query().where("workspaceId", "=", wsId).orderBy("createdAt", "DESC").limit(20).get();
  const contactCount = await db.Contact.query().where("workspaceId", "=", wsId).count();

  const currentSub = subscriptions.find((s: any) => s.status === "active" || s.status === "trialing");
  const currentPlan = currentSub
    ? plans.find((p: any) => p.id === currentSub.planId)
    : null;

  return NextResponse.json({
    workspace,
    currentPlan,
    currentSub,
    plans,
    invoices,
    contactCount,
    branchCount: 0,
  });
}
