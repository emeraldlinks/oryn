import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");

  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);

    if (contactId) {
      const messages = await db.ChatMessage.query()
        .where("workspaceId", "=", wsId)
        .where("contactId", "=", Number(contactId))
        .orderBy("createdAt", "ASC")
        .get();
      return NextResponse.json(messages);
    }

    const allVisitorMessages = await db.ChatMessage.query()
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .get();

    const visitorMap = new Map<string, any[]>();
    for (const msg of allVisitorMessages as any[]) {
      if (!msg.visitorId) continue;
      if (!visitorMap.has(msg.visitorId)) visitorMap.set(msg.visitorId, []);
      visitorMap.get(msg.visitorId)!.push(msg);
    }

    const summary: any[] = [];
    for (const [vid, msgs] of visitorMap) {
      const last = msgs[0];
      const unread = msgs.filter((m: any) => !m.readAt && m.sender === "visitor").length;
      summary.push({
        visitorId: vid,
        visitorName: last?.visitorName || "Visitor",
        visitorEmail: last?.visitorEmail || null,
        lastMessage: last?.body || "",
        lastTime: last?.createdAt || "",
        unread,
      });
    }

    summary.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
    return NextResponse.json(summary.slice(0, 50));
  });
}
