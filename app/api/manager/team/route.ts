import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["manager", "admin", "superadmin"]);
  if (error) return error;
  const members = await db.Employee.query().where({ workspaceId: user.workspaceId }).get() || [];
  return NextResponse.json(members);
}
