import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const applications = await db.JobApplication.query()
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .get();

  const enriched = [];
  for (const app of applications) {
    const candidate = await db.Candidate.query().where("id", "=", app.candidateId).where("workspaceId", "=", wsId).first();
    const job = await db.JobPosting.query().where("id", "=", app.jobId).where("workspaceId", "=", wsId).first();
    enriched.push({ ...app, candidate, job });
  }

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (!body.jobId || !body.candidateId) {
    return NextResponse.json({ error: "jobId and candidateId required" }, { status: 400 });
  }

  const existing = await db.JobApplication.query()
    .where("workspaceId", "=", wsId)
    .where("jobId", "=", Number(body.jobId))
    .where("candidateId", "=", Number(body.candidateId))
    .first();

  if (existing) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  const application = await db.JobApplication.insert({
    workspaceId: wsId,
    jobId: Number(body.jobId),
    candidateId: Number(body.candidateId),
    coverLetter: body.coverLetter || null,
    cvUrl: body.cvUrl || null,
    stage: "applied",
    appliedAt: new Date().toISOString(),
    scoreBreakdown: body.scoreBreakdown || null,
    totalScore: body.totalScore || null,
  });

  await db.JobPosting.update(
    { id: Number(body.jobId), workspaceId: wsId },
    { applicationsCount: (await db.JobPosting.query().where("id", "=", Number(body.jobId)).first())?.applicationsCount + 1 || 1 }
  );

  return NextResponse.json(application, { status: 201 });
}
