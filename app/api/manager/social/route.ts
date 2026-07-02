import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["manager", "admin", "superadmin"]);
  if (error) return error;
  const posts = await db.SocialPost.query().where({ workspaceId: user.workspaceId }).orderBy("createdAt", "DESC").get() || [];
  return NextResponse.json(posts);
}
