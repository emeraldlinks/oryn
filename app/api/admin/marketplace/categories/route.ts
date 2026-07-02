import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const listings = await db.MarketplaceListing.query()
    .where("published", "=", true)
    .select("categories")
    .get();

  const countMap: Record<string, number> = {};
  for (const item of listings) {
    if (Array.isArray(item.categories)) {
      for (const cat of item.categories) {
        countMap[cat] = (countMap[cat] || 0) + 1;
      }
    }
  }

  const categories = Object.entries(countMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json(categories);
}
