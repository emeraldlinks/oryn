import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";
import crypto from "crypto";

function generateHex(length: number) {
  return crypto.randomBytes(length / 2).toString("hex");
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);

    const apps = await withDb(async (db) => {
      return db.OAuthApp.query()
        .where({ workspaceId: wsId })
        .order("createdAt", "desc")
        .run();
    });

    const masked = apps.map((app: any) => ({
      ...app,
      clientSecret: "****",
    }));

    return NextResponse.json(masked);
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
    const { searchParams } = new URL(req.url);

    if (searchParams.has("rotate")) {
      const app = await withDb(async (db) => {
        return db.OAuthApp.query()
          .where({ id: Number(body.id), workspaceId: wsId })
          .first();
      });
      if (!app) return NextResponse.json({ error: "OAuth app not found" }, { status: 404 });

      const newSecret = generateHex(48);
      await withDb(async (db) => {
        return db.OAuthApp.update({ id: Number(body.id), workspaceId: wsId }, { clientSecret: newSecret });
      });

      return NextResponse.json({ clientSecret: newSecret });
    }

    const clientId = generateHex(32);
    const clientSecret = generateHex(48);

    const app = await withDb(async (db) => {
      return db.OAuthApp.insert({
        workspaceId: wsId,
        name: body.name,
        redirectUris: body.redirectUris,
        scopes: body.scopes,
        clientId,
        clientSecret,
        active: true,
      });
    });

    return NextResponse.json(app, { status: 201 });
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
      return db.OAuthApp.update({ id: Number(id), workspaceId: wsId }, data);
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
      return db.OAuthApp.delete({ id: Number(id), workspaceId: wsId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
