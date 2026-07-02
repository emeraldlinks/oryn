import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const [depts, positions, employees, activeShifts, pendingLeave, openDisciplinary] = await Promise.all([
    db.StaffDepartment.count({ workspaceId: wsId }),
    db.StaffPosition.count({ workspaceId: wsId }),
    db.Employee.count({ workspaceId: wsId }),
    db.StaffSchedule.count({ workspaceId: wsId }),
    db.StaffLeaveRequest.count({ workspaceId: wsId, status: "pending" }),
    db.StaffDisciplinaryAction.count({ workspaceId: wsId, status: "open" }),
  ]);
  return NextResponse.json({ totalDepartments: depts, totalPositions: positions, totalEmployees: employees, activeSchedules: activeShifts, pendingLeave, openDisciplinary });
}
