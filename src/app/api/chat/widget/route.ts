import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const visitorId = searchParams.get("visitorId");
    const since = searchParams.get("since");

    if (!workspaceId || !visitorId) {
      return NextResponse.json(
        { error: "workspaceId and visitorId are required" },
        { status: 400 }
      );
    }

    const messages = await withDb(async (db) => {
      let query = db.ChatMessage.query()
        .where("workspaceId", "=", Number(workspaceId))
        .where("visitorId", "=", visitorId);

      if (since) {
        query = query.where("createdAt", ">", since);
      }

      const results = await query.orderBy("createdAt", "ASC").get();

      return results.filter(
        (m) => m.sender === "visitor" || m.sender === "agent" || m.sender === "system"
      );
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/chat/widget error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, visitorId, visitorName, visitorEmail, body: messageBody, contactId, userId, sender } = body;

    if (!workspaceId || !visitorId || !messageBody) {
      return NextResponse.json(
        { error: "workspaceId, visitorId, and body are required" },
        { status: 400 }
      );
    }

    const message = await withDb(async (db) => {
      return db.ChatMessage.insert({
        workspaceId: Number(workspaceId),
        visitorId,
        visitorName: visitorName || undefined,
        visitorEmail: visitorEmail || undefined,
        contactId: contactId ? Number(contactId) : undefined,
        userId: userId ? Number(userId) : undefined,
        body: messageBody,
        sender: userId ? "agent" : sender || "visitor",
      });
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("POST /api/chat/widget error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
