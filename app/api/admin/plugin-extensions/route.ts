import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const pluginId = searchParams.get("pluginId");

  const pluginIds = (
    await db.Plugin.query()
      .where("workspaceId", "=", wsId)
      .select("id")
      .get()
  ).map((p: any) => p.id);

  const q = db.PluginExtension.query().whereIn("pluginId", pluginIds);
  if (pluginId) q.where("pluginId", "=", Number(pluginId));
  q.preload("plugin").orderBy("name", "ASC");

  const extensions = await q.get();
  return NextResponse.json(extensions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const extension = await db.PluginExtension.insert({
    pluginId: body.pluginId,
    extensionType: body.extensionType,
    name: body.name,
    config: body.config || {},
    active: body.active ?? true,
  });

  return NextResponse.json(extension, { status: 201 });
}
