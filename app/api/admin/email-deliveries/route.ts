import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);

  let query = db.EmailDelivery.query().where("workspaceId", "=", wsId);
  if (status) query = query.where("status", "=", status);
  if (search) {
    query = query.whereRaw(
      '(LOWER("recipient") LIKE LOWER(?) OR LOWER("subject") LIKE LOWER(?))',
      [`%${search}%`, `%${search}%`]
    );
  }

  const deliveries = await query.orderBy("createdAt", "DESC").limit(limit).get();
  return NextResponse.json(deliveries);
}
