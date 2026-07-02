import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;

  const wId = user.workspaceId;

  const tasks = await db.Task.query().where({ workspaceId: wId, assignedTo: Number(user.id) }).limit(5).get() || [];
  const activities = await db.Activity.query().where({ workspaceId: wId, userId: Number(user.id) }).orderBy("createdAt", "DESC").limit(5).get() || [];

  return NextResponse.json({ tasks, activities });
}
