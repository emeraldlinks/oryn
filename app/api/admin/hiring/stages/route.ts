import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  let stages = await db.HiringStage.query()
    .where("workspaceId", "=", wsId)
    .orderBy("sortOrder", "ASC")
    .get();

  if (stages.length === 0) {
    const defaults = [
      { name: "Applied", type: "applied", sortOrder: 0 },
      { name: "Screening", type: "screening", sortOrder: 1 },
      { name: "Shortlisted", type: "shortlist", sortOrder: 2 },
      { name: "Interview", type: "interview", sortOrder: 3 },
      { name: "Offer", type: "offer", sortOrder: 4 },
      { name: "Hired", type: "hired", sortOrder: 5 },
      { name: "Rejected", type: "rejected", sortOrder: 6 },
    ];
    for (const s of defaults) {
      await db.HiringStage.insert({ workspaceId: wsId, ...s, status: "active", isDefault: true });
    }
    stages = await db.HiringStage.query()
      .where("workspaceId", "=", wsId)
      .orderBy("sortOrder", "ASC")
      .get();
  }

  return NextResponse.json(stages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const stage = await db.HiringStage.insert({
    workspaceId: wsId,
    name: body.name,
    description: body.description || null,
    sortOrder: body.sortOrder || 0,
    type: body.type || "custom",
    status: "active",
    isDefault: false,
  });

  return NextResponse.json(stage, { status: 201 });
}
