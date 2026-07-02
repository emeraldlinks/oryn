import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active");

  return withDb(async (db) => {
    let query = db.SalesPipeline.query().where("workspaceId", "=", wsId);
    if (active === "true") {
      query = query.where("active", "=", true);
    }
    const pipelines = await query.orderBy("sortOrder", "ASC").get();
    return NextResponse.json(pipelines);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  return withDb(async (db) => {
    if (body.isDefault) {
      await db.SalesPipeline.update({ workspaceId: wsId, isDefault: true }, { isDefault: false });
    }

    const pipeline = await db.SalesPipeline.insert({
      workspaceId: wsId,
      name: body.name,
      stages: body.stages,
      isDefault: body.isDefault ?? false,
      active: true,
      sortOrder: 0,
    });

    return NextResponse.json(pipeline, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    if (data.isDefault) {
      await db.SalesPipeline.update({ workspaceId: wsId, isDefault: true }, { isDefault: false });
    }
    await db.SalesPipeline.update({ id: Number(id), workspaceId: wsId }, data);
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const wsId = Number(session.user.workspaceId);
  return withDb(async (db) => {
    await db.SalesPipeline.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
