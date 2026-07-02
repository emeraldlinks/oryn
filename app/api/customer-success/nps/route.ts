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
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      let query = db.NPSResponse.query()
        .where("workspaceId", "=", wsId)
        .preload("contact");

      if (contactId) {
        query = query.where("contactId", "=", Number(contactId));
      }

      const responses = await query.get();
      const total = responses.length;
      let averageNps = null;

      if (total > 0) {
        const promoters = responses.filter((r: any) => r.score >= 9).length;
        const detractors = responses.filter((r: any) => r.score <= 6).length;
        averageNps = ((promoters - detractors) / total) * 100;
      }

      return NextResponse.json({ responses, averageNps, total });
    });
  } catch (err) {
    console.error("NPS GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contactId, score, comment } = body;

    if (score < 0 || score > 10) {
      return NextResponse.json({ error: "Score must be between 0 and 10" }, { status: 400 });
    }

    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      const response = await db.NPSResponse.insert({
        workspaceId: wsId,
        contactId: Number(contactId),
        score,
        comment,
      });
      return NextResponse.json(response, { status: 201 });
    });
  } catch (err) {
    console.error("NPS POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
