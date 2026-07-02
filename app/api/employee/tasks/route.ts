import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;
  const tasks = await db.Task.query().where({ workspaceId: user.workspaceId, assignedTo: Number(user.id) }).orderBy("createdAt", "DESC").get() || [];
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const { user, error } = await requireAuth(["employee", "manager", "admin", "superadmin"]);
  if (error) return error;
  const body = await req.json();
  const task = await db.Task.insert({ ...body, workspaceId: user.workspaceId, assignedTo: Number(user.id) });
  return NextResponse.json(task, { status: 201 });
}
