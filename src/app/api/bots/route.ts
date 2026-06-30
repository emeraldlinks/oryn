import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  return withDb(async (db) => {
    let query = db.Bot.query().where("workspaceId", "=", wsId);
    if (channel) {
      query = query.where("channel", "=", channel);
    }
    const bots = await query.orderBy("createdAt", "DESC").get();
    return NextResponse.json(bots);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const isTest = searchParams.get("test") === "true";

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (isTest) {
    return withDb(async (db) => {
      const { id, message } = body;
      if (!id || !message) {
        return NextResponse.json({ error: "Bot id and message required" }, { status: 400 });
      }
      const bot = await db.Bot.get({ id: Number(id), workspaceId: wsId });
      if (!bot) return NextResponse.json({ error: "Bot not found" }, { status: 404 });

      if (bot.aiModel === "keyword") {
        const keywords = bot.triggerKeywords.split(",").map((k) => k.trim().toLowerCase());
        const matched = keywords.some((k) => message.toLowerCase().includes(k));
        return NextResponse.json({
          matched,
          response: matched ? bot.responseTemplate : null,
        });
      }

      return NextResponse.json({
        matched: true,
        response: `[${bot.aiModel} simulated response to: "${message}"]`,
      });
    });
  }

  return withDb(async (db) => {
    const bot = await db.Bot.insert({
      workspaceId: wsId,
      name: body.name,
      channel: body.channel,
      triggerKeywords: body.triggerKeywords,
      responseTemplate: body.responseTemplate,
      aiModel: body.aiModel || "keyword",
      config: body.config || null,
      active: body.active ?? true,
      totalConversations: 0,
    });
    return NextResponse.json(bot, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    await db.Bot.update({ id: Number(id), workspaceId: wsId }, data);
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const wsId = Number(session.user.workspaceId);
  return withDb(async (db) => {
    await db.Bot.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
