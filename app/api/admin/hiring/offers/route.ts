import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const offers = await db.OfferLetter.query()
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .get();

  const enriched = [];
  for (const o of offers) {
    const app = await db.JobApplication.query().where("id", "=", o.applicationId).first();
    const candidate = app ? await db.Candidate.query().where("id", "=", app.candidateId).first() : null;
    enriched.push({ ...o, candidate });
  }

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (!body.applicationId) {
    return NextResponse.json({ error: "applicationId required" }, { status: 400 });
  }

  const offer = await db.OfferLetter.insert({
    workspaceId: wsId,
    applicationId: Number(body.applicationId),
    approvedById: body.approvedById ? Number(body.approvedById) : null,
    offeredSalary: body.offeredSalary || null,
    currency: body.currency || "NGN",
    startDate: body.startDate || null,
    terms: body.terms || null,
    benefits: body.benefits || null,
    status: "draft",
  });

  return NextResponse.json(offer, { status: 201 });
}
