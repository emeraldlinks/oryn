import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("contactId");
    const ticketId = searchParams.get("ticketId");
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      let query = db.CSATResponse.query()
        .where("workspaceId", "=", wsId)
        .preload("contact");

      if (contactId) {
        query = query.where("contactId", "=", Number(contactId));
      }
      if (ticketId) {
        query = query.where("ticketId", "=", Number(ticketId));
      }

      const responses = await query.get();
      const total = responses.length;
      const averageCsat = total > 0
        ? responses.reduce((sum: number, r: any) => sum + r.score, 0) / total
        : null;

      return NextResponse.json({ responses, averageCsat, total });
    });
  } catch (err) {
    console.error("CSAT GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contactId, ticketId, score, comment } = body;

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 });
    }

    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      const response = await db.CSATResponse.insert({
        workspaceId: wsId,
        contactId: Number(contactId),
        ticketId: ticketId ? Number(ticketId) : undefined,
        score,
        comment,
      });
      return NextResponse.json(response, { status: 201 });
    });
  } catch (err) {
    console.error("CSAT POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
