import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const contact = await db.Contact.query().where("workspaceId", "=", wsId).where("email", "=", session.user.email).first();
  if (!contact) return NextResponse.json([]);
  const orders = await db.Order.query()
    .preload("items")
    .where("workspaceId", "=", wsId)
    .where("contactId", "=", contact.id)
    .orderBy("createdAt", "DESC").get();
  return NextResponse.json(orders);
}
