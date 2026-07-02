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
    const riskLevel = searchParams.get("riskLevel");
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      let query = db.ChurnPrediction.query()
        .where("workspaceId", "=", wsId)
        .preload("contact");

      if (contactId) {
        query = query.where("contactId", "=", Number(contactId));
      }
      if (riskLevel) {
        query = query.where("riskLevel", "=", riskLevel);
      }

      const predictions = await query.get();
      const total = predictions.length;
      const churnRate = total > 0
        ? predictions.reduce((sum: number, p: any) => sum + p.riskScore, 0) / total
        : null;

      return NextResponse.json({ predictions, churnRate, total });
    });
  } catch (err) {
    console.error("Churn GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contactId, riskScore, riskLevel, factors } = body;
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      const existing = await db.ChurnPrediction.get({
        workspaceId: wsId,
        contactId: Number(contactId),
      });

      if (existing) {
        const updated = await db.ChurnPrediction.update(
          { id: existing.id, workspaceId: wsId },
          { riskScore, riskLevel, factors, predictedAt: new Date().toISOString() }
        );
        return NextResponse.json(updated);
      }

      const created = await db.ChurnPrediction.insert({
        workspaceId: wsId,
        contactId: Number(contactId),
        riskScore,
        riskLevel,
        factors,
        predictedAt: new Date().toISOString(),
      });
      return NextResponse.json(created, { status: 201 });
    });
  } catch (err) {
    console.error("Churn POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
