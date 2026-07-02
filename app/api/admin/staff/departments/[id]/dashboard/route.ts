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

  const employeeCount = await db.Employee.count({ workspaceId: wsId, departmentId: deptId });

  const assignments = await db.DepartmentModuleAssignment.query()
    .preload("module")
    .where("workspaceId", "=", wsId)
    .where("departmentId", "=", deptId)
    .where("isActive", "=", true)
    .get();

  const modules = assignments
    .filter((a: any) => a.module?.isActive)
    .map((a: any) => ({
      id: a.module.id,
      key: a.module.key,
      name: a.module.name,
      description: a.module.description,
      icon: a.module.icon,
      category: a.module.category,
      href: a.module.href,
      config: a.config,
    }));

  return NextResponse.json({
    department,
    stats: { employeeCount, moduleCount: modules.length },
    modules,
  });
}
