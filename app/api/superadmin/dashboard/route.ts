import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["superadmin", "admin"]);
  if (error) return error;

  const wId = user.workspaceId;

  const workspaces = await db.Workspace.query().get() || [];
  const users = await db.User.query().get() || [];
  const activeUsers = users.filter((u: any) => u.role !== "superadmin");
  const recentActivity = await db.Activity.query().orderBy("createdAt", "DESC").limit(10).get() || [];

  return NextResponse.json({
    totalWorkspaces: workspaces.length,
    totalUsers: users.length,
    activeUsers: activeUsers.length,
    recentActivity,
  });
}
