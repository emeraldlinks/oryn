import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entityType");
  const period = searchParams.get("period");

  const q = db.UsageRecord.query().where("workspaceId", "=", wsId);
  if (entityType) q.where("entityType", "=", entityType);
  if (period) q.where("period", "=", period);
  q.orderBy("createdAt", "DESC").limit(200);

  const records = await q.get();
  return NextResponse.json(records);
}
