import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const id = Number(params.id);

  const job = await db.JobPosting.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const applications = await db.JobApplication.query()
    .where("jobId", "=", id)
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .get();

  const enriched = [];
  for (const app of applications) {
    const candidate = await db.Candidate.query().where("id", "=", app.candidateId).where("workspaceId", "=", wsId).first();
    enriched.push({ ...app, candidate });
  }

  return NextResponse.json({ ...job, applications: enriched });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const id = Number(params.id);
  const body = await req.json();

  const existing = await db.JobPosting.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, any> = {};
  const fields = ["title","department","description","requirements","responsibilities","location","employmentType","minSalary","maxSalary","currency","status"];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }

  await db.JobPosting.update({ id, workspaceId: wsId }, data);
  const updated = await db.JobPosting.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  return NextResponse.json(updated);
}
