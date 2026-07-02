import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.Asset.query()
    .preload("contact")
    .where("workspaceId", "=", wsId);

  const contactId = searchParams.get("contactId");
  if (contactId) query = query.where("contactId", "=", Number(contactId));

  const type = searchParams.get("type");
  if (type) query = query.where("type", "=", type);

  const assets = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(assets);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const asset = await db.Asset.insert({
    name: body.name,
    type: body.type,
    contactId: body.contactId || null,
    purchaseDate: body.purchaseDate || null,
    warrantyEnd: body.warrantyEnd || null,
    value: body.value ?? null,
    metadata: body.metadata || null,
    workspaceId: Number(session.user.workspaceId),
  });

  return NextResponse.json(asset, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  await db.Asset.update(
    { id: Number(id), workspaceId: Number(session.user.workspaceId) },
    data
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.Asset.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
