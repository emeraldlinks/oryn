import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const userEmail = session.user.email;

  const contact = await db.Contact.query()
    .where("workspaceId", "=", wsId)
    .where("email", "=", userEmail)
    .first();

  const contactId = contact?.id;

  const orderCount = contactId ? await db.Order.count({ workspaceId: wsId, contactId }) : 0;
  const invoiceCount = contactId ? await db.Invoice.count({ workspaceId: wsId, contactId }) : 0;
  const ticketCount = contactId ? await db.Ticket.count({ workspaceId: wsId, contactId }) : 0;

  const orders = contactId
    ? await db.Order.query().where("workspaceId", "=", wsId).where("contactId", "=", contactId).orderBy("createdAt", "DESC").limit(3).get()
    : [];

  return NextResponse.json({
    contact: contact || null,
    contactId,
    stats: {
      activeOrders: orderCount,
      openInvoices: invoiceCount,
      supportTickets: ticketCount,
    },
    recentOrders: orders,
  });
}
