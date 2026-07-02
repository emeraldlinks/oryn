import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const q = db.MarketplaceListing.query();
  q.where("published", "=", true);
  if (type && type !== "all") q.where("type", "=", type);
  if (search) q.where("name", "ILIKE", `%${search}%`);
  if (category && category !== "all") q.where("categories", "@>", JSON.stringify([category]));

  switch (sort) {
    case "top-rated": q.orderBy("rating", "DESC"); break;
    case "recently-updated": q.orderBy("updatedAt", "DESC"); break;
    case "newest": q.orderBy("createdAt", "DESC"); break;
    case "name": q.orderBy("name", "ASC"); break;
    default: q.orderBy("installCount", "DESC");
  }

  const countQ = db.MarketplaceListing.query();
  countQ.where("published", "=", true);
  if (type && type !== "all") countQ.where("type", "=", type);
  if (search) countQ.where("name", "ILIKE", `%${search}%`);
  if (category && category !== "all") countQ.where("categories", "@>", JSON.stringify([category]));
  const total = await countQ.count();

  const listings = await q.offset((page - 1) * limit).limit(limit).get();
  return NextResponse.json({ items: listings, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const listing = await db.MarketplaceListing.insert({
    type: body.type,
    name: body.name,
    description: body.description || null,
    version: body.version,
    author: body.author || null,
    iconUrl: body.iconUrl || null,
    config: body.config || {},
    verified: body.verified ?? false,
    published: body.published ?? true,
  });

  return NextResponse.json(listing, { status: 201 });
}
