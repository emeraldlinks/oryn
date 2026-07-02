import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const jobs = await db.JobPosting.query()
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .get();

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const job = await db.JobPosting.insert({
    workspaceId: wsId,
    title: body.title,
    department: body.department || null,
    description: body.description || null,
    requirements: body.requirements || null,
    responsibilities: body.responsibilities || null,
    location: body.location || null,
    employmentType: body.employmentType || null,
    minSalary: body.minSalary || null,
    maxSalary: body.maxSalary || null,
    currency: body.currency || "NGN",
    status: body.status || "draft",
  });

  return NextResponse.json(job, { status: 201 });
}
