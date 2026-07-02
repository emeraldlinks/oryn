import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const jobs = await db.JobPosting.query().where("workspaceId", "=", wsId).get();
  const applications = await db.JobApplication.query().where("workspaceId", "=", wsId).get();
  const candidates = await db.Candidate.query().where("workspaceId", "=", wsId).get();
  const interviews = await db.Interview.query().where("workspaceId", "=", wsId).get();
  const offers = await db.OfferLetter.query().where("workspaceId", "=", wsId).get();

  const activeJobs = jobs.filter((j: any) => j.status === "active");
  const totalApplicants = applications.length;
  const screened = applications.filter((a: any) => a.stage !== "applied").length;
  const shortlisted = applications.filter((a: any) => a.stage === "shortlisted" || a.stage === "interviewed").length;
  const hired = applications.filter((a: any) => a.stage === "hired").length;
  const pendingInterviews = interviews.filter((i: any) => i.status === "scheduled").length;
  const pendingOffers = offers.filter((o: any) => o.status === "draft" || o.status === "sent").length;

  const stageBreakdown = [
    { stage: "Applied", count: applications.filter((a: any) => a.stage === "applied").length },
    { stage: "Screened", count: applications.filter((a: any) => a.stage === "screened").length },
    { stage: "Shortlisted", count: applications.filter((a: any) => a.stage === "shortlisted").length },
    { stage: "Interviewed", count: applications.filter((a: any) => a.stage === "interviewed").length },
    { stage: "Offered", count: applications.filter((a: any) => a.stage === "offered").length },
    { stage: "Hired", count: applications.filter((a: any) => a.stage === "hired").length },
    { stage: "Rejected", count: applications.filter((a: any) => a.stage === "rejected").length },
  ];

  return NextResponse.json({
    stats: {
      activeJobs: activeJobs.length,
      totalJobs: jobs.length,
      totalApplicants,
      screened,
      shortlisted,
      hired,
      pendingInterviews,
      pendingOffers,
      totalCandidates: candidates.length,
    },
    stageBreakdown,
    recentApplications: applications.slice(-10).reverse(),
    upcomingInterviews: interviews.filter((i: any) => i.status === "scheduled").slice(0, 5),
  });
}
