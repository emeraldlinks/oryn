import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["superadmin", "admin"]);
  if (error) return error;
  const users = await db.User.query().get() || [];
  return NextResponse.json(users);
}
