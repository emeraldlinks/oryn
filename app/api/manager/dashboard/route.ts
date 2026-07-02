import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["manager", "admin", "superadmin"]);
  if (error) return error;
  const wId = user.workspaceId;

  const team = await db.Employee.query().where({ workspaceId: wId }).get() || [];
  const pipelineStages = await db.Deal.query().where({ workspaceId: wId }).get() || [];
  const tasks = await db.Task.query().where({ workspaceId: wId }).limit(5).get() || [];

  const stageCount: Record<string, number> = {};
  pipelineStages.forEach((d: any) => { stageCount[d.stage] = (stageCount[d.stage] || 0) + 1; });

  return NextResponse.json({ team: team.slice(0, 10), pipelineStages: stageCount, tasks });
}
