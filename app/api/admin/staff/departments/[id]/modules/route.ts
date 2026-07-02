import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const deptId = Number(params.id);

  const department = await db.StaffDepartment.get({ id: deptId, workspaceId: wsId });
  if (!department) return NextResponse.json({ error: "Department not found" }, { status: 404 });

  const allModules = await db.DepartmentModule.query()
    .where("workspaceId", "=", wsId)
    .where("isActive", "=", true)
    .orderBy("sortOrder", "ASC")
    .orderBy("name", "ASC")
    .get();

  const assignments = await db.DepartmentModuleAssignment.query()
    .where("workspaceId", "=", wsId)
    .where("departmentId", "=", deptId)
    .get();

  const assignedMap = new Map<number, any>();
  for (const a of assignments) assignedMap.set(a.moduleId, a);

  const result = allModules.map((m) => ({
    ...m,
    assigned: assignedMap.has(m.id),
    assignment: assignedMap.get(m.id) || null,
  }));

  return NextResponse.json({ department, modules: result });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const deptId = Number(params.id);
  const body = await req.json();

  const existing = await db.DepartmentModuleAssignment.query()
    .where("workspaceId", "=", wsId)
    .where("departmentId", "=", deptId)
    .where("moduleId", "=", Number(body.moduleId))
    .first();

  if (existing) {
    await db.DepartmentModuleAssignment.update(
      { id: existing.id },
      { isActive: body.isActive !== false, config: body.config || null }
    );
    return NextResponse.json({ success: true });
  }

  const assignment = await db.DepartmentModuleAssignment.insert({
    workspaceId: wsId,
    departmentId: deptId,
    moduleId: Number(body.moduleId),
    config: body.config || null,
    isActive: body.isActive !== false,
  });

  return NextResponse.json(assignment, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const deptId = Number(params.id);
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");
  if (!moduleId) return NextResponse.json({ error: "moduleId required" }, { status: 400 });

  await db.DepartmentModuleAssignment.delete({
    workspaceId: wsId,
    departmentId: deptId,
    moduleId: Number(moduleId),
  });

  return NextResponse.json({ success: true });
}
