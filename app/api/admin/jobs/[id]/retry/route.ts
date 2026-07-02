import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const job = await db.BackgroundJob.query()
    .where("id", "=", Number(params.id))
    .where("workspaceId", "=", wsId)
    .first();

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.BackgroundJob.update(
    { id: job.id, workspaceId: wsId },
    { status: "pending", attempts: 0, errorMessage: null, nextRetryAt: null }
  );
  return NextResponse.json(updated);
}
