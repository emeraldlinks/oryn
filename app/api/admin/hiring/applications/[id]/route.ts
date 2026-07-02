import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const id = Number(params.id);
  const body = await req.json();

  const existing = await db.JobApplication.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, any> = {};
  const validFields = ["stage", "scoreBreakdown", "totalScore", "notes", "isViewed", "reviewerId", "coverLetter"];
  for (const f of validFields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.stage && body.stage !== existing.stage) {
    data.stageChangedAt = new Date().toISOString();
  }
  if (body.isViewed && !existing.isViewed) {
    data.viewedAt = new Date().toISOString();
  }

  await db.JobApplication.update({ id, workspaceId: wsId }, data);
  const updated = await db.JobApplication.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  return NextResponse.json(updated);
}
