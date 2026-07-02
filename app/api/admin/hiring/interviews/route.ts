import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const interviews = await db.Interview.query()
    .where("workspaceId", "=", wsId)
    .orderBy("scheduledAt", "ASC")
    .get();

  const enriched = [];
  for (const iv of interviews) {
    const candidate = await db.Candidate.query().where("id", "=", iv.candidateId).first();
    enriched.push({ ...iv, candidate });
  }

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (!body.applicationId || !body.candidateId || !body.scheduledAt || !body.type) {
    return NextResponse.json({ error: "applicationId, candidateId, scheduledAt, type required" }, { status: 400 });
  }

  const interview = await db.Interview.insert({
    workspaceId: wsId,
    applicationId: Number(body.applicationId),
    candidateId: Number(body.candidateId),
    interviewerId: body.interviewerId ? Number(body.interviewerId) : null,
    type: body.type,
    scheduledAt: body.scheduledAt,
    durationMinutes: body.durationMinutes || 60,
    location: body.location || null,
    meetingLink: body.meetingLink || null,
    status: "scheduled",
  });

  return NextResponse.json(interview, { status: 201 });
}
