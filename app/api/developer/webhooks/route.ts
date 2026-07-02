import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);

    const result = await withDb(async (db) => {
      return db.WebhookEndpoint.query()
        .where({ workspaceId: wsId })
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

    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const wsId = Number(session.user.workspaceId);

    if (searchParams.has("test")) {
      const endpoint = await withDb(async (db) => {
        return db.WebhookEndpoint.query()
          .where({ id: Number(body.id), workspaceId: wsId })
          .first();
      });
      if (!endpoint) return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Test payload simulated", endpoint: endpoint.name });
    }

    const webhook = await withDb(async (db) => {
      return db.WebhookEndpoint.insert({
        workspaceId: wsId,
        name: body.name,
        url: body.url,
        events: body.events,
        headers: body.headers,
        active: true,
        successCount: 0,
        failureCount: 0,
      });
    });

    return NextResponse.json(webhook, { status: 201 });
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
      return db.WebhookEndpoint.update({ id: Number(id), workspaceId: wsId }, data);
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
      return db.WebhookEndpoint.delete({ id: Number(id), workspaceId: wsId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
