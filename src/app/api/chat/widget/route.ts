import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("wsId");
  if (!workspaceId) return NextResponse.json({ error: "wsId required" }, { status: 400 });

  const db = await initDb();
  const settings = await db.LiveChatSettings.get({ workspaceId: Number(workspaceId) });

  return NextResponse.json({
    enabled: settings?.enabled ?? true,
    widgetColor: (settings as any)?.widgetColor || "#3b82f6",
    welcomeMessage: (settings as any)?.welcomeMessage || "Hi! How can we help you?",
    awayMessage: (settings as any)?.awayMessage,
    collectEmail: (settings as any)?.collectEmail || false,
    showAgentNames: (settings as any)?.showAgentNames ?? true,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await initDb();
  const wsId = Number(body.workspaceId);

  const existing = await db.LiveChatSettings.get({ workspaceId: wsId });
  if (existing) {
    await db.LiveChatSettings.update({ id: existing.id }, body);
    return NextResponse.json({ success: true });
  }

  const settings = await db.LiveChatSettings.insert({
    workspaceId: wsId,
    enabled: body.enabled ?? true,
    widgetColor: body.widgetColor || "#3b82f6",
    welcomeMessage: body.welcomeMessage,
    awayMessage: body.awayMessage,
    collectEmail: body.collectEmail || false,
    showAgentNames: body.showAgentNames ?? true,
  });

  return NextResponse.json(settings, { status: 201 });
}
