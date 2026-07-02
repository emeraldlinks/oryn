import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const listingId = Number(params.id);

  const existing = await db.InstalledItem.query()
    .where("workspaceId", "=", wsId)
    .where("listingId", "=", listingId)
    .first();

  if (existing) return NextResponse.json(existing);

  const item = await db.InstalledItem.insert({
    workspaceId: wsId,
    listingId,
    installedById: Number(session.user.id),
  });

  await db.MarketplaceListing.update({ id: listingId }, { installCount: db.raw('"installCount" + 1') });

  return NextResponse.json(item, { status: 201 });
}
