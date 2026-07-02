import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.settings !== undefined) data.settings = body.settings;
  if (body.active !== undefined) data.active = body.active;

  await db.InstalledItem.update({ id: Number(params.id), workspaceId: wsId }, data);
  const item = await db.InstalledItem.get({ id: Number(params.id), workspaceId: wsId });
  return NextResponse.json(item);
}
