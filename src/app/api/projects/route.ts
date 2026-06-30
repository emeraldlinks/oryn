import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tasks = searchParams.get("tasks");

    const result = await withDb(async (db) => {
      const query = db.Project.query()
        .where({ workspaceId: wsId })
        .preload("owner")
        .order("createdAt", "desc");

      if (status) query.where({ status });
      if (tasks === "true") query.preload("tasks");

      return query.run();
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const wsId = Number(session.user.workspaceId);

    const project = await withDb(async (db) => {
      return db.Project.insert({
        workspaceId: wsId,
        name: body.name,
        description: body.description,
        status: body.status || "active",
        priority: body.priority || "medium",
        startDate: body.startDate,
        endDate: body.endDate,
        tags: body.tags,
        ownerId: body.ownerId ? Number(body.ownerId) : undefined,
      });
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;
    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.Project.update({ id: Number(id), workspaceId: wsId }, data);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.Project.delete({ id: Number(id), workspaceId: wsId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
