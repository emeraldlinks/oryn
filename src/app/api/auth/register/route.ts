import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { initDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, workspaceName } = await req.json();

    if (!name || !email || !password || !workspaceName) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = await initDb();

    const existing = await db.User.get({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const slug = workspaceName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

    const workspace = await db.Workspace.insert({
      name: workspaceName,
      slug,
      plan: "starter",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.User.insert({
      workspaceId: workspace.id,
      name,
      email,
      passwordHash,
      role: "superadmin",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, workspaceId: workspace.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
