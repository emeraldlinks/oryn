import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

const VALID_PROVIDERS = ["openai", "gemini", "deepseek", "claude", "qwen", "kimi", "nvidia", "opencode"];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const userId = Number(session.user.id);
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "user";

  return withDb(async (db) => {
    let query = db.AIApiKey.query().where("workspaceId", "=", wsId);

    if (scope === "user") {
      query = query.where("userId", "=", userId);
    } else if (scope === "workspace") {
      query = query.where("scope", "=", "workspace");
    }

    const keys = await query.orderBy("createdAt", "DESC").get();
    return NextResponse.json(keys);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const userId = Number(session.user.id);
  const role = session.user.role as string;
  const body = await req.json();

  if (!body.provider || !body.apiKey) {
    return NextResponse.json({ error: "Provider and apiKey are required" }, { status: 400 });
  }

  if (!VALID_PROVIDERS.includes(body.provider)) {
    return NextResponse.json({ error: `Invalid provider. Valid: ${VALID_PROVIDERS.join(", ")}` }, { status: 400 });
  }

  const scope = body.scope || "user";

  if (scope === "workspace" && role !== "admin" && role !== "superadmin") {
    return NextResponse.json({ error: "Only admins can create workspace-level API keys" }, { status: 403 });
  }

  return withDb(async (db) => {
    const key = await db.AIApiKey.insert({
      workspaceId: wsId,
      userId: scope === "user" ? userId : undefined,
      provider: body.provider,
      apiKey: body.apiKey,
      scope,
      active: body.active ?? true,
    });
    return NextResponse.json(key, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  return withDb(async (db) => {
    const existing = await db.AIApiKey.get({ id: Number(id), workspaceId: wsId });
    if (!existing) return NextResponse.json({ error: "API key not found" }, { status: 404 });

    await db.AIApiKey.update({ id: Number(id), workspaceId: wsId }, data);
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const userId = Number(session.user.id);
  const role = session.user.role as string;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  return withDb(async (db) => {
    const key = await db.AIApiKey.get({ id: Number(id), workspaceId: wsId });
    if (!key) return NextResponse.json({ error: "API key not found" }, { status: 404 });

    const isOwner = key.userId === userId;
    const isAdmin = role === "admin" || role === "superadmin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.AIApiKey.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
