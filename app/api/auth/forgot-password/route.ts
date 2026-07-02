import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Always return success regardless of whether email exists (security)
  const user = await db.User.where("email").equals(email).first();
  if (user) {
    // In production, send email here via nodemailer
    console.log(`[Password Reset] Requested for ${email} (workspace ${user.workspaceId})`);
  }

  return NextResponse.json({ success: true });
}
