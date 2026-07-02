import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

const VALID_PROVIDERS = [
  "claude_connector",
  "perplexity",
  "custom",
  "openai_assistant",
  "make.com",
  "zapier",
] as const;

const DEFAULT_ACTIONS = [
  "create_contact",
  "list_contacts",
  "create_deal",
  "update_deal_stage",
  "list_deals",
  "create_activity",
  "create_ticket",
  "list_tickets",
  "send_email",
  "create_notification",
  "get_forecast",
  "create_project",
  "list_projects",
];

function generateApiKey(): string {
  return "oryn_" + crypto.randomBytes(24).toString("hex");
}

function generateApiSecret(): string {
  return "sk-" + crypto.randomBytes(32).toString("hex");
}

function maskSecret(connection: Record<string, unknown>): Record<string, unknown> {
  return { ...connection, apiSecret: "****" };
}

function maskKey(key: string): string {
  if (key.length <= 16) return "****";
  return key.slice(0, 5) + "..." + key.slice(-6);
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const userId = Number((session.user as any).id);
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const result = await withDb(async (db) => {
      const query = db.BotConnection.query()
        .where({ workspaceId: wsId, userId })
        .preload("owner")
        .order("createdAt", "desc");

      if (!includeInactive) {
        query.where({ deletedAt: null });
      }

      return query.run();
    });

    const masked = (result as any[]).map((conn: Record<string, unknown>) => ({
      ...maskSecret(conn),
      apiKey: maskKey(conn.apiKey as string),
    }));

    return NextResponse.json(masked);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, provider, allowedActions, expiresAt } = body;

    if (!name || typeof name !== "string" || name.length < 3 || name.length > 200) {
      return NextResponse.json({ error: "Name must be between 3 and 200 characters" }, { status: 400 });
    }

    if (!provider || !VALID_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const wsId = Number(session.user.workspaceId);
    const userId = Number((session.user as any).id);

    const apiKey = generateApiKey();
    const apiSecret = generateApiSecret();

    const connection = await withDb(async (db) => {
      return db.BotConnection.insert({
        workspaceId: wsId,
        userId,
        name,
        provider,
        apiKey,
        apiSecret,
        status: "active",
        active: true,
        allowedActions: allowedActions || DEFAULT_ACTIONS,
        expiresAt: expiresAt || null,
        totalRequests: 0,
      });
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || "http://localhost:3000";

    return NextResponse.json(
      {
        ...connection,
        webhookUrl: `${baseUrl}/api/bot-actions`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, name, status, active, allowedActions, expiresAt } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);
    const userId = Number((session.user as any).id);

    await withDb(async (db) => {
      const existing = await db.BotConnection.get({ id: Number(id), workspaceId: wsId, userId });
      if (!existing) throw new Error("Not found");

      const updates: Record<string, unknown> = {};
      if (name !== undefined) updates.name = name;
      if (status !== undefined) updates.status = status;
      if (active !== undefined) updates.active = active;
      if (allowedActions !== undefined) updates.allowedActions = allowedActions;
      if (expiresAt !== undefined) updates.expiresAt = expiresAt;

      return db.BotConnection.update({ id: Number(id), workspaceId: wsId }, updates);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "Not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const hard = searchParams.get("hard") === "true";

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);
    const userId = Number((session.user as any).id);

    await withDb(async (db) => {
      const existing = await db.BotConnection.get({ id: Number(id), workspaceId: wsId, userId });
      if (!existing) throw new Error("Not found");

      if (hard) {
        return db.BotConnection.delete({ id: Number(id), workspaceId: wsId });
      }

      return db.BotConnection.update(
        { id: Number(id), workspaceId: wsId },
        { deletedAt: new Date().toISOString(), status: "revoked", active: false }
      );
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "Not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
