import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);
    const responses = await db.CannedResponse.query()
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .get();
    return NextResponse.json(responses);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);
    const response = await db.CannedResponse.insert({
      workspaceId: wsId,
      title: body.title,
      bodyHtml: body.bodyHtml,
      shortcuts: body.shortcuts || [],
      category: body.category || undefined,
    });
    return NextResponse.json(response, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);
    await db.CannedResponse.update(
      { id: Number(body.id), workspaceId: wsId },
      {
        title: body.title,
        bodyHtml: body.bodyHtml,
        shortcuts: body.shortcuts || [],
        category: body.category || undefined,
      }
    );
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  return withDb(async (db) => {
    const wsId = Number(session.user.workspaceId);
    await db.CannedResponse.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
