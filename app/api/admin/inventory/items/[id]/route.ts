import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const item = await db.InventoryItem.query()
    .where("id", "=", Number(params.id))
    .where("workspaceId", "=", wsId)
    .preload("category")
    .preload("brand")
    .first();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
