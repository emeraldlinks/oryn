import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  let quota = await db.WorkspaceQuota.get({ workspaceId: wsId });
  if (!quota) {
    quota = await db.WorkspaceQuota.insert({
      workspaceId: wsId,
      maxUsers: 10,
      maxStorageGb: 5,
      maxContacts: 1000,
      maxDeals: 500,
      maxProjects: 20,
      canUseAI: false,
      canUseAPI: false,
      canUseAutomation: false,
      canUseStaffManagement: false,
      canUseInventory: false,
    });
  }

  return NextResponse.json(quota);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.maxUsers !== undefined) data.maxUsers = body.maxUsers;
  if (body.maxStorageGb !== undefined) data.maxStorageGb = body.maxStorageGb;
  if (body.maxContacts !== undefined) data.maxContacts = body.maxContacts;
  if (body.maxDeals !== undefined) data.maxDeals = body.maxDeals;
  if (body.maxProjects !== undefined) data.maxProjects = body.maxProjects;
  if (body.canUseAI !== undefined) data.canUseAI = body.canUseAI;
  if (body.canUseAPI !== undefined) data.canUseAPI = body.canUseAPI;
  if (body.canUseAutomation !== undefined) data.canUseAutomation = body.canUseAutomation;
  if (body.canUseStaffManagement !== undefined) data.canUseStaffManagement = body.canUseStaffManagement;
  if (body.canUseInventory !== undefined) data.canUseInventory = body.canUseInventory;
  if (body.limits !== undefined) data.limits = body.limits;

  const existing = await db.WorkspaceQuota.get({ workspaceId: wsId });
  if (existing) {
    await db.WorkspaceQuota.update({ workspaceId: wsId }, data);
  } else {
    await db.WorkspaceQuota.insert({
      workspaceId: wsId,
      maxUsers: 10,
      maxStorageGb: 5,
      maxContacts: 1000,
      maxDeals: 500,
      maxProjects: 20,
      canUseAI: false,
      canUseAPI: false,
      canUseAutomation: false,
      canUseStaffManagement: false,
      canUseInventory: false,
      ...data,
    });
  }

  const quota = await db.WorkspaceQuota.get({ workspaceId: wsId });
  return NextResponse.json(quota);
}
