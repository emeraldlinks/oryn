import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["manager", "admin", "superadmin"]);
  if (error) return error;
  const leads = await db.Contact.query().where({ workspaceId: user.workspaceId, status: "lead" }).get() || [];
  return NextResponse.json(leads);
}
