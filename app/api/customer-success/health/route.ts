import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("contactId");
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      let query = db.HealthScore.query()
        .where("workspaceId", "=", wsId)
        .preload("contact");

      if (contactId) {
        query = query.where("contactId", "=", Number(contactId));
      }

      const scores = await query.get();
      return NextResponse.json(scores);
    });
  } catch (err) {
    console.error("HealthScore GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contactId, score, category, notes, factors } = body;
    const wsId = Number(session.user.workspaceId);

    return withDb(async (db) => {
      const existing = await db.HealthScore.get({
        workspaceId: wsId,
        contactId: Number(contactId),
      });

      if (existing) {
        const updated = await db.HealthScore.update(
          { id: existing.id, workspaceId: wsId },
          { score, category, notes, factors }
        );
        return NextResponse.json(updated);
      }

      const created = await db.HealthScore.insert({
        workspaceId: wsId,
        contactId: Number(contactId),
        score,
        category,
        notes,
        factors,
      });
      return NextResponse.json(created, { status: 201 });
    });
  } catch (err) {
    console.error("HealthScore POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const contactId = searchParams.get("contactId");
    const wsId = Number(session.user.workspaceId);

    if (!id && !contactId) {
      return NextResponse.json({ error: "id or contactId required" }, { status: 400 });
    }

    return withDb(async (db) => {
      if (id) {
        await db.HealthScore.delete({ id: Number(id), workspaceId: wsId });
      } else {
        await db.HealthScore.delete({ contactId: Number(contactId), workspaceId: wsId });
      }
      return NextResponse.json({ success: true });
    });
  } catch (err) {
    console.error("HealthScore DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
