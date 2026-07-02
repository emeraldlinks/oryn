import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.MarketingSegment.query().where("workspaceId", "=", wsId);

  const search = searchParams.get("search");
  if (search) {
    query = query.whereRaw('LOWER("name") LIKE LOWER(?)', [`%${search}%`]);
  }

  const segments = await query.orderBy("createdAt", "DESC").get();
  return NextResponse.json(segments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const count = searchParams.get("count");

  const body = await req.json();
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  if (count === "1") {
    const segment = await db.MarketingSegment.get({ id: Number(body.id), workspaceId: wsId });
    if (!segment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const filters = segment.filters as any;
    const conditions = filters?.conditions || [];
    let contactQuery = db.Contact.query().where("workspaceId", "=", wsId);

    for (const c of conditions) {
      if (c.operator === "equals") {
        contactQuery = contactQuery.where(c.field, "=", c.value);
      } else if (c.operator === "contains") {
        contactQuery = contactQuery.whereRaw(
          `LOWER(??) LIKE LOWER(?)`,
          [c.field, `%${c.value}%`]
        );
      } else if (c.operator === "gt") {
        contactQuery = contactQuery.where(c.field, ">", Number(c.value));
      } else if (c.operator === "lt") {
        contactQuery = contactQuery.where(c.field, "<", Number(c.value));
      }
    }

    const count = await contactQuery.count();
    await db.MarketingSegment.update(
      { id: Number(body.id), workspaceId: wsId },
      { contactCount: count }
    );

    return NextResponse.json({ contactCount: count });
  }

  const segment = await db.MarketingSegment.insert({
    workspaceId: wsId,
    name: body.name,
    filters: body.filters || { conditions: [], logic: "and" },
    contactCount: 0,
  });

  return NextResponse.json(segment, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const db = await initDb();

  await db.MarketingSegment.update(
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

  const db = await initDb();
  await db.MarketingSegment.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
