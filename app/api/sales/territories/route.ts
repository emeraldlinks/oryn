import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  return withDb(async (db) => {
    let query = db.Territory.query()
      .where("workspaceId", "=", wsId)
      .preload("manager");

    if (search) {
      query = query.where("name", "LIKE", `%${search}%`);
    }

    const territories = await query.orderBy("name", "ASC").get();
    return NextResponse.json(territories);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  return withDb(async (db) => {
    const territory = await db.Territory.insert({
      workspaceId: wsId,
      name: body.name,
      regions: body.regions || null,
      managerId: body.managerId ? Number(body.managerId) : undefined,
    });
    return NextResponse.json(territory, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    const updateData: any = { ...data };
    if (data.managerId) updateData.managerId = Number(data.managerId);
    await db.Territory.update({ id: Number(id), workspaceId: wsId }, updateData);
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
    await db.Territory.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
