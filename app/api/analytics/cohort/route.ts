import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period");
  const wsId = Number(session.user.workspaceId);

  let query = db.CohortData.query().where("workspaceId", "=", wsId);

  if (period) {
    query = query.where("period", "=", period);
  }

  const cohorts = await query.orderBy("cohortDate", "DESC").get();
  return NextResponse.json(cohorts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const cohort = await db.CohortData.insert({
    workspaceId: Number(session.user.workspaceId),
    cohortDate: body.cohortDate,
    period: body.period,
    userCount: body.userCount,
    retentionData: body.retentionData,
  });

  return NextResponse.json(cohort, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.CohortData.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
