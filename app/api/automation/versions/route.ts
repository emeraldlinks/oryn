import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId");
  const compare = searchParams.get("compare");
  const v1 = searchParams.get("v1");
  const v2 = searchParams.get("v2");

  const db = await initDb();

  if (compare === "1" && v1 && v2) {
    const [version1, version2] = await Promise.all([
      db.WorkflowVersion.get({ id: Number(v1) }),
      db.WorkflowVersion.get({ id: Number(v2) }),
    ]);
    return NextResponse.json({ v1: version1, v2: version2 });
  }

  if (!workflowId) return NextResponse.json({ error: "workflowId required" }, { status: 400 });

  const versions = await db.WorkflowVersion.query()
    .where("workflowId", "=", Number(workflowId))
    .orderBy("version", "DESC")
    .get();

  return NextResponse.json(versions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { workflowId, definition, notes } = body;
  const db = await initDb();

  const latest = await db.WorkflowVersion.query()
    .where("workflowId", "=", Number(workflowId))
    .orderBy("version", "DESC")
    .first();

  const nextVersion = latest ? (latest as any).version + 1 : 1;

  const version = await db.WorkflowVersion.insert({
    workflowId: Number(workflowId),
    version: nextVersion,
    definition,
    notes: notes || null,
  });

  return NextResponse.json(version, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.WorkflowVersion.delete({ id: Number(id) });

  return NextResponse.json({ success: true });
}
