import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("contactId");
    const status = searchParams.get("status");
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      let query = db.OnboardingTask.query()
        .where("workspaceId", "=", wsId)
        .preload("assignee")
        .orderBy("sortOrder", "ASC");

      if (contactId) {
        query = query.where("contactId", "=", Number(contactId));
      }
      if (status) {
        query = query.where("status", "=", status);
      }

      const tasks = await query.get();
      return NextResponse.json(tasks);
    });
  } catch (err) {
    console.error("Onboarding GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contactId, title, description, dueDate, assignedTo } = body;
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      const task = await db.OnboardingTask.insert({
        workspaceId: wsId,
        contactId: Number(contactId),
        title,
        description,
        dueDate,
        assignedTo: assignedTo ? Number(assignedTo) : undefined,
        sortOrder: 0,
      });
      return NextResponse.json(task, { status: 201 });
    });
  } catch (err) {
    console.error("Onboarding POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, status } = body;
    const wsId = Number(session.user.workspaceId);

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    return withDb(async (db) => {
      const updateData: Record<string, unknown> = {};
      if (status) {
        updateData.status = status;
        if (status === "completed") {
          updateData.completedAt = new Date().toISOString();
        }
      }

      await db.OnboardingTask.update(
        { id: Number(id), workspaceId: wsId },
        updateData
      );
      return NextResponse.json({ success: true });
    });
  } catch (err) {
    console.error("Onboarding PUT error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const wsId = Number(session.user.workspaceId);

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    return withDb(async (db) => {
      await db.OnboardingTask.delete({ id: Number(id), workspaceId: wsId });
      return NextResponse.json({ success: true });
    });
  } catch (err) {
    console.error("Onboarding DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
