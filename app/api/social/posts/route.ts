import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await initDb();
    const wsId = Number(session.user.workspaceId);
    const { searchParams } = new URL(req.url);

    // Calendar view: aggregate posts by day
    if (searchParams.get("calendar") === "1") {
      const month = searchParams.get("month");
      if (!month) return NextResponse.json({ error: "month query param required (YYYY-MM)" }, { status: 400 });

      const [yearStr, monthStr] = month.split("-");
      const year = Number(yearStr);
      const monthNum = Number(monthStr);
      const startDate = `${year}-${monthStr.padStart(2, "0")}-01`;
      const lastDay = new Date(year, monthNum, 0).getDate();
      const endDate = `${year}-${monthStr.padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const posts = await db.SocialPost.query()
        .where("workspaceId", "=", wsId)
        .where("scheduledAt", ">=", startDate)
        .where("scheduledAt", "<=", endDate + "T23:59:59.999Z")
        .get();

      const calendar: Record<string, number> = {};
      for (const post of posts) {
        const date = post.scheduledAt ? post.scheduledAt.split("T")[0] : post.createdAt.split("T")[0];
        calendar[date] = (calendar[date] || 0) + 1;
      }

      return NextResponse.json(calendar);
    }

    // Standard list with filters
    let query = db.SocialPost.query()
      .preload("account")
      .where("workspaceId", "=", wsId);

    const status = searchParams.get("status");
    if (status) query = query.where("status", "=", status);

    const platform = searchParams.get("platform");
    if (platform) {
      const accounts = await db.SocialAccount.query()
        .where("workspaceId", "=", wsId)
        .where("platform", "=", platform)
        .get();
      const accountIds = accounts.map(a => a.id);
      if (accountIds.length === 0) return NextResponse.json([]);
      query = query.where("socialAccountId", "IN", accountIds);
    }

    const socialAccountId = searchParams.get("socialAccountId");
    if (socialAccountId) query = query.where("socialAccountId", "=", Number(socialAccountId));

    const search = searchParams.get("search");
    if (search) query = query.where("content", "ILIKE", `%${search}%`);

    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    if (limit) query = query.limit(Number(limit));
    if (offset) query = query.offset(Number(offset));

    const posts = await query.orderBy("createdAt", "DESC").get();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await initDb();
    const wsId = Number(session.user.workspaceId);
    const body = await req.json();
    const { searchParams } = new URL(req.url);

    // Publish immediately
    if (searchParams.get("publish") === "1") {
      const id = body.id;
      if (!id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

      const existing = await db.SocialPost.query()
        .where("id", "=", Number(id))
        .where("workspaceId", "=", wsId)
        .first();

      if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });

      await db.SocialPost.update(
        { id: Number(id), workspaceId: wsId },
        {
          status: "published",
          publishedAt: existing.publishedAt || new Date().toISOString(),
        }
      );

      const updated = await db.SocialPost.query()
        .preload("account")
        .where("id", "=", Number(id))
        .first();

      return NextResponse.json(updated);
    }

    // Validate socialAccountId belongs to this workspace
    const account = await db.SocialAccount.query()
      .where("id", "=", Number(body.socialAccountId))
      .where("workspaceId", "=", wsId)
      .first();

    if (!account) return NextResponse.json({ error: "Social account not found in this workspace" }, { status: 400 });

    const post = await db.SocialPost.insert({
      socialAccountId: Number(body.socialAccountId),
      content: body.content,
      mediaUrls: body.mediaUrls || [],
      status: body.status || "draft",
      scheduledAt: body.scheduledAt || undefined,
      workspaceId: wsId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await initDb();
    const wsId = Number(session.user.workspaceId);

    // If status changing to published and no publishedAt, set it
    if (data.status === "published") {
      const existing = await db.SocialPost.query()
        .where("id", "=", Number(id))
        .where("workspaceId", "=", wsId)
        .first();

      if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });

      if (!existing.publishedAt) {
        data.publishedAt = new Date().toISOString();
      }
    }

    await db.SocialPost.update(
      { id: Number(id), workspaceId: wsId },
      data
    );

    const updated = await db.SocialPost.query()
      .preload("account")
      .where("id", "=", Number(id))
      .first();

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await initDb();
    const wsId = Number(session.user.workspaceId);

    await db.SocialPost.delete({ id: Number(id), workspaceId: wsId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
