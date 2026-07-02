import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["superadmin", "admin"]);
  if (error) return error;
  const invoices = await db.Invoice.query().get() || [];
  const subscriptions = await db.Subscription.query().get() || [];
  return NextResponse.json({ invoices, subscriptions });
}
