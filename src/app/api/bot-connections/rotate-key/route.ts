import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

function generateApiKey(): string {
  return "oryn_" + crypto.randomBytes(24).toString("hex");
}

function generateApiSecret(): string {
  return "sk-" + crypto.randomBytes(32).toString("hex");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);
    const userId = Number((session.user as any).id);
    const newApiKey = generateApiKey();
    const newApiSecret = generateApiSecret();

    const result = await withDb(async (db) => {
      const existing = await db.BotConnection.get({ id: Number(id), workspaceId: wsId, userId });
      if (!existing) throw new Error("Not found");

      await db.BotConnection.update(
        { id: Number(id), workspaceId: wsId },
        { apiKey: newApiKey, apiSecret: newApiSecret }
      );

      return { apiKey: newApiKey, apiSecret: newApiSecret };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.message === "Not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
