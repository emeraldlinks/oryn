import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const projectId = Number(params.id);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const result = await withDb(async (db) => {
      const query = db.ProjectTask.query()
        .where({ projectId, workspaceId: wsId })
        .preload("assignee")
        .preload("milestone")
        .preload("subtasks")
        .order("createdAt", "desc");

      if (status) query.where({ status });

      return query.run();
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const wsId = Number(session.user.workspaceId);
    const projectId = Number(params.id);

    const task = await withDb(async (db) => {
      return db.ProjectTask.insert({
        workspaceId: wsId,
        projectId,
        title: body.title,
        description: body.description,
        status: body.status || "todo",
        priority: body.priority || "medium",
        assigneeId: body.assigneeId ? Number(body.assigneeId) : undefined,
        milestoneId: body.milestoneId ? Number(body.milestoneId) : undefined,
        dueDate: body.dueDate,
        estimatedHours: body.estimatedHours,
        parentTaskId: body.parentTaskId ? Number(body.parentTaskId) : undefined,
      });
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, ...data } = body;
    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.ProjectTask.update({ id: Number(id), workspaceId: wsId }, data);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.ProjectTask.delete({ id: Number(id), workspaceId: wsId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
