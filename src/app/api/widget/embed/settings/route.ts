import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);
    const settings = await db.WidgetSettings.query()
      .where("workspaceId", "=", wsId)
      .preload("defaultBot")
      .preload("workspace")
      .first();

    if (!settings) return NextResponse.json({ error: "Widget not configured" }, { status: 404 });

    return NextResponse.json(settings);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);
    const existing = await db.WidgetSettings.get({ workspaceId: wsId });

    const data = {
      enabled: body.enabled ?? true,
      primaryColor: body.primaryColor || "#6366f1",
      welcomeMessage: body.welcomeMessage,
      collectEmail: body.collectEmail ?? false,
      showAgentNames: body.showAgentNames ?? true,
      enableBots: body.enableBots ?? false,
      defaultBotId: body.defaultBotId ? Number(body.defaultBotId) : undefined,
      allowedDomains: body.allowedDomains,
      position: body.position || "right",
    };

    if (existing) {
      await db.WidgetSettings.update({ id: existing.id }, data);
      return NextResponse.json({ success: true });
    }

    const settings = await db.WidgetSettings.insert({
      ...data,
      workspaceId: wsId,
    });

    return NextResponse.json(settings, { status: 201 });
  });
}
