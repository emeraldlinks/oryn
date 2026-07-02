import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days")) || 30;
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      const now = new Date();
      const future = new Date(now.getTime() + days * 86400000).toISOString();

      const subscriptions = await db.Subscription.query()
        .where("workspaceId", "=", wsId)
        .where("endDate", "<=", future)
        .where("endDate", ">=", now.toISOString())
        .where("status", "=", "active")
        .preload("contact")
        .preload("plan")
        .get();

      const renewals = subscriptions.map((sub: any) => {
        const endDate = new Date(sub.endDate);
        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - Date.now()) / 86400000
        );
        return {
          subscription: sub,
          contact: sub.contact,
          plan: sub.plan,
          daysUntilExpiry,
        };
      });

      return NextResponse.json(renewals);
    });
  } catch (err) {
    console.error("Renewals GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { subscriptionId } = body;
    const wsId = Number(session.user.workspaceId);

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId required" }, { status: 400 });
    }

    return withDb(async (db) => {
      const subscription = await db.Subscription.get({
        id: Number(subscriptionId),
        workspaceId: wsId,
      });

      if (!subscription) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
      }

      const contact = await db.Contact.get({
        id: subscription.contactId,
        workspaceId: wsId,
      });

      if (contact?.assignedTo) {
        await db.Notification.insert({
          workspaceId: wsId,
          userId: contact.assignedTo,
          type: "renewal_reminder",
          title: "Renewal Reminder",
          body: `Subscription for ${contact.firstName} ${contact.lastName} is expiring soon.`,
          meta: { subscriptionId: subscription.id, contactId: contact.id },
        });
      }

      return NextResponse.json({ success: true });
    });
  } catch (err) {
    console.error("Renewals POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
