import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const listingId = Number(params.id);

  const reviews = await db.MarketplaceReview.query()
    .where("listingId", "=", listingId)
    .preload("user")
    .orderBy("createdAt", "DESC")
    .get();

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  for (const review of reviews) {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    totalRating += review.rating;
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

  return NextResponse.json({ reviews, averageRating, totalReviews, distribution });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const listingId = Number(params.id);
  const userId = Number(session.user.id);
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const installed = await db.InstalledItem.query()
    .where("workspaceId", "=", wsId)
    .where("listingId", "=", listingId)
    .first();
  if (!installed) return NextResponse.json({ error: "Must install before reviewing" }, { status: 403 });

  const existing = await db.MarketplaceReview.query()
    .where("listingId", "=", listingId)
    .where("userId", "=", userId)
    .first();
  if (existing) return NextResponse.json({ error: "Already reviewed" }, { status: 409 });

  const review = await db.MarketplaceReview.insert({
    listingId,
    userId,
    rating: body.rating,
    content: body.content || null,
  });

  const allReviews = await db.MarketplaceReview.query()
    .where("listingId", "=", listingId)
    .get();

  let totalRating = 0;
  for (const r of allReviews) totalRating += r.rating;
  const newAvg = allReviews.length > 0 ? Math.round((totalRating / allReviews.length) * 10) / 10 : 0;

  await db.MarketplaceListing.update({ id: listingId }, {
    rating: newAvg,
    reviewCount: allReviews.length,
  });

  return NextResponse.json(review, { status: 201 });
}
