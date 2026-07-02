import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;
  const posts = await db.SocialPost.query().preload("account").where({ workspaceId: user.workspaceId }).orderBy("createdAt", "DESC").get() || [];
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;
  const body = await req.json();
  const post = await db.SocialPost.insert({
    workspaceId: user.workspaceId,
    socialAccountId: body.socialAccountId || 1,
    content: body.content,
    status: body.status || "draft",
    scheduledAt: body.scheduledAt || null,
  });
  return NextResponse.json(post, { status: 201 });
}
