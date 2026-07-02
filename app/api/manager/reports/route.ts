import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["manager", "admin", "superadmin"]);
  if (error) return error;
  const wId = user.workspaceId;

  const deals = await db.Deal.query().where({ workspaceId: wId }).get() || [];
  const contacts = await db.Contact.query().where({ workspaceId: wId }).get() || [];
  const activities = await db.Activity.query().where({ workspaceId: wId }).get() || [];

  const totalPipeline = deals.reduce((s: number, d: any) => s + (Number(d.value) || 0), 0);
  const wonDeals = deals.filter((d: any) => d.stage === "closed-won");
  const wonValue = wonDeals.reduce((s: number, d: any) => s + (Number(d.value) || 0), 0);
  const conversionRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  return NextResponse.json({
    totalPipeline,
    wonValue,
    conversionRate,
    totalDeals: deals.length,
    totalContacts: contacts.length,
    totalActivities: activities.length,
  });
}
