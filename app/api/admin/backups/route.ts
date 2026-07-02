import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const records = await db.BackupRecord.query()
    .where("workspaceId", "=", wsId)
    .orderBy("createdAt", "DESC")
    .get();
  return NextResponse.json(records);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const record = await db.BackupRecord.insert({
    workspaceId: wsId,
    type: body.type,
    status: "pending",
  });
  return NextResponse.json(record, { status: 201 });
}
