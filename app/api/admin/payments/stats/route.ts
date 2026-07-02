import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const payments = await db.PaystackPayment.query()
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .limit(200)
    .get();

  const successful = payments.filter((p: any) => p.status === "success");
  const totalRevenue = successful.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const failed = payments.filter((p: any) => p.status === "failed");
  const pending = payments.filter((p: any) => p.status === "pending");

  const gateway = await db.PaymentGateway.query()
    .where("workspaceId", "=", wsId)
    .where("provider", "=", "paystack")
    .first();

  return NextResponse.json({
    payments,
    stats: {
      total: payments.length,
      successful: successful.length,
      failed: failed.length,
      pending: pending.length,
      totalRevenue,
      configured: !!gateway?.active,
    },
  });
}
