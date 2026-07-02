import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;
  const calls = await db.Call.query().where({ workspaceId: user.workspaceId, userId: Number(user.id) }).orderBy("createdAt", "DESC").get() || [];
  return NextResponse.json(calls);
}
