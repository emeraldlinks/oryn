import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const resolvedTickets = await db.Ticket.query()
    .where("workspaceId", "=", wsId)
    .whereNotNull("resolvedAt")
    .get();

  let avgResolutionTime = "0d";
  if (resolvedTickets.length > 0) {
    const totalMs = resolvedTickets.reduce((sum, t) => {
      const created = new Date(t.createdAt).getTime();
      const resolved = new Date(t.resolvedAt!).getTime();
      return sum + (resolved - created);
    }, 0);
    const avgDays = totalMs / resolvedTickets.length / (1000 * 60 * 60 * 24);
    avgResolutionTime = `${avgDays.toFixed(1)}d`;
  }

  return NextResponse.json({ avgResolutionTime });
}
