import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);

  const db = await initDb();
  const devices = await db.UserDevice.query()
    .where("userId", "=", userId)
    .orderBy("lastUsedAt", "DESC")
    .get();

  return NextResponse.json(devices);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, trusted } = body;

  const db = await initDb();
  const device = await db.UserDevice.get({ id: Number(id), userId: Number((session.user as any).id) });

  if (!device) return NextResponse.json({ error: "Device not found" }, { status: 404 });

  await db.UserDevice.update({ id: Number(id) }, { trusted });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.UserDevice.delete({ id: Number(id), userId: Number((session.user as any).id) });

  return NextResponse.json({ success: true });
}
