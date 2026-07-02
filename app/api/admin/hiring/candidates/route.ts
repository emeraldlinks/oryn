import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const candidates = await db.Candidate.query()
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .get();

  return NextResponse.json(candidates);
}
