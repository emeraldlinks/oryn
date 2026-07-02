import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;
  const deals = await db.Deal.query().where({ workspaceId: user.workspaceId, assignedTo: Number(user.id) }).get() || [];
  return NextResponse.json(deals);
}
