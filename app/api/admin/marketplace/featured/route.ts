import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const items = await db.MarketplaceListing.query()
    .where("featured", "=", true)
    .where("published", "=", true)
    .orderBy("installCount", "DESC")
    .limit(6)
    .get();
  return NextResponse.json(items);
}
