import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseCV, scoreCV, calculateOverallScore, getDefaultMetrics } from "@/lib/cv-scanner";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const formData = await req.formData();
  const file = formData.get("cv") as File | null;
  const jobId = formData.get("jobId") ? Number(formData.get("jobId")) : null;

  if (!file) return NextResponse.json({ error: "CV file required" }, { status: 400 });

  const text = await file.text();
  const parsed = parseCV(text);

  let metrics = await db.HiringMetric.query()
    .where("workspaceId", "=", wsId)
    .where("enabled", "=", true)
    .get();

  if (metrics.length === 0) {
    const defaults = getDefaultMetrics();
    for (const m of defaults) {
      await db.HiringMetric.insert({
        workspaceId: wsId, name: m.name, description: m.description,
        category: m.category, maxScore: m.maxScore, weight: m.weight,
        enabled: true, sortOrder: m.id,
      });
    }
    metrics = await db.HiringMetric.query()
      .where("workspaceId", "=", wsId)
      .where("enabled", "=", true)
      .get();
  }

  let jobRequirements = { requiredSkills: [] as string[], preferredSkills: [] as string[], minExperience: 0, educationField: "" };
  if (jobId) {
    const job = await db.JobPosting.query().where("id", "=", jobId).where("workspaceId", "=", wsId).first();
    if (job) {
      const reqs = job.requirements ? (typeof job.requirements === "string" ? JSON.parse(job.requirements) : job.requirements) : [];
      const desc = job.description || "";
      jobRequirements = {
        requiredSkills: reqs,
        preferredSkills: [],
        minExperience: 0,
        educationField: "",
      };
    }
  }

  const scores = scoreCV(parsed, jobRequirements, metrics, jobId ? "" : undefined);
  const overallScore = calculateOverallScore(scores);

  const scoreMap: Record<string, number> = {};
  for (const s of scores) {
    scoreMap[s.name] = Math.round((s.score / s.maxScore) * 100);
  }

  const insights: string[] = [];
  const lowScores = scores.filter((s) => (s.score / s.maxScore) < 0.5);
  const highScores = scores.filter((s) => (s.score / s.maxScore) >= 0.7);
  if (highScores.length > 0) insights.push(`Strong in: ${highScores.map((s) => s.name).join(", ")}`);
  if (lowScores.length > 0) insights.push(`Development areas: ${lowScores.map((s) => s.name).join(", ")}`);
  if (parsed.skills.length > 0) insights.push(`${parsed.skills.length} skills identified`);
  if (parsed.totalExperienceYears > 0) insights.push(`${parsed.totalExperienceYears} years of experience`);
  if (parsed.certifications.length > 0) insights.push(`${parsed.certifications.length} certifications`);

  let candidate = await db.Candidate.query()
    .where("workspaceId", "=", wsId)
    .where("email", "=", parsed.email)
    .first();

  const candidateData = {
    workspaceId: wsId,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    email: parsed.email,
    phone: parsed.phone,
    summary: parsed.summary,
    skills: parsed.skills,
    experience: parsed.experience,
    education: parsed.education,
    certifications: parsed.certifications,
    totalExperienceYears: parsed.totalExperienceYears,
    currentCompany: parsed.currentCompany,
    currentPosition: parsed.currentPosition,
    linkedInUrl: parsed.linkedInUrl,
    aiScore: scoreMap,
    overallScore,
    aiInsights: insights,
    parsedCv: parsed,
    status: "active",
  };

  if (candidate) {
    await db.Candidate.update({ id: candidate.id!, workspaceId: wsId }, candidateData);
    candidate = { ...candidate, ...candidateData };
  } else {
    candidate = await db.Candidate.insert(candidateData);
  }

  return NextResponse.json({
    candidate,
    scores,
    overallScore,
    insights,
    parsed,
  });
}
