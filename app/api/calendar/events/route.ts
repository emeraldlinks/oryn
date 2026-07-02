import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const userId = Number(session.user.id);
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const targetUserId = searchParams.get("userId");

    const result = await withDb(async (db) => {
      const query = db.CalendarEvent.query()
        .where({ workspaceId: wsId })
        .order("startTime", "asc");

      if (targetUserId) {
        query.where({ userId: Number(targetUserId) });
      } else {
        query.where({ userId });
      }

      if (from) query.where("startTime", ">=", from);
      if (to) query.where("endTime", "<=", to);

      return query.run();
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const wsId = Number(session.user.workspaceId);
    const userId = Number(session.user.id);

    const event = await withDb(async (db) => {
      return db.CalendarEvent.insert({
        workspaceId: wsId,
        userId,
        title: body.title,
        description: body.description,
        startTime: body.startTime,
        endTime: body.endTime,
        allDay: body.allDay ?? false,
        color: body.color,
        attendees: body.attendees,
        contactId: body.contactId ? Number(body.contactId) : undefined,
        location: body.location,
      });
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;
    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.CalendarEvent.update({ id: Number(id), workspaceId: wsId }, data);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.CalendarEvent.delete({ id: Number(id), workspaceId: wsId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
