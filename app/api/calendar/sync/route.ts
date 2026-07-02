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

    const result = await withDb(async (db) => {
      return db.CalendarSync.query()
        .where({ workspaceId: wsId, userId })
        .order("createdAt", "desc")
        .run();
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

    const sync = await withDb(async (db) => {
      const existing = await db.CalendarSync.query()
        .where({ workspaceId: wsId, userId, provider: body.provider })
        .first();

      if (existing) {
        await db.CalendarSync.update({ id: existing.id }, {
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
          expiresAt: body.expiresAt,
        });
        return db.CalendarSync.query().where({ id: existing.id }).first();
      }

      return db.CalendarSync.insert({
        workspaceId: wsId,
        userId,
        provider: body.provider,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        expiresAt: body.expiresAt,
        active: true,
      });
    });

    return NextResponse.json(sync, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const userId = Number(session.user.id);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const provider = searchParams.get("provider");

    if (id) {
      await withDb(async (db) => {
        return db.CalendarSync.delete({ id: Number(id), workspaceId: wsId, userId });
      });
    } else if (provider) {
      await withDb(async (db) => {
        return db.CalendarSync.delete({ workspaceId: wsId, userId, provider });
      });
    } else {
      return NextResponse.json({ error: "ID or provider required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
