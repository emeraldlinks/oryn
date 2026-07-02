import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const method = searchParams.get("method");
    const statusCode = searchParams.get("statusCode");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 500);
    const offset = Number(searchParams.get("offset")) || 0;

    const result = await withDb(async (db) => {
      const query = db.APILogEntry.query()
        .where({ workspaceId: wsId })
        .order("createdAt", "desc");

      if (userId) query.where({ userId: Number(userId) });
      if (method) query.where({ method });
      if (statusCode) query.where({ statusCode: Number(statusCode) });

      return query.limit(limit).offset(offset).run();
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
