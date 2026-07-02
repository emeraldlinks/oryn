import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["superadmin", "admin"]);
  if (error) return error;

  const users = await db.User.query().get() || [];
  const workspaces = await db.Workspace.query().get() || [];
  const deals = await db.Deal.query().get() || [];
  const totalRevenue = deals.reduce((s: number, d: any) => s + (Number(d.value) || 0), 0);

  return NextResponse.json({
    totalUsers: users.length,
    totalWorkspaces: workspaces.length,
    totalDeals: deals.length,
    totalRevenue,
    activeUsers: users.filter((u: any) => u.lastLoginAt).length,
  });
}
