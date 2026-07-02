import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const id = Number(params.id);

  const domain = await db.CustomDomain.query()
    .where("id", "=", id)
    .where("workspaceId", "=", wsId)
    .first();

  if (!domain) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.CustomDomain.update({ id, workspaceId: wsId }, {
    verified: true,
    verifiedAt: new Date().toISOString(),
  });

  const updated = await db.CustomDomain.query()
    .where("id", "=", id)
    .where("workspaceId", "=", wsId)
    .first();

  return NextResponse.json(updated);
}
