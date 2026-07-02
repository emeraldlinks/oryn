import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { clearCache } from "@/lib/plugin-system";
import type { PluginManifest } from "@/lib/plugin-system";

const extensionTypeMap: Record<string, string> = {
  pages: "page",
  actions: "action",
  models: "model",
  webhooks: "webhook",
  aiTools: "ai_tool",
  widgets: "widget",
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const body = await req.json();
  const manifest = body.manifest as PluginManifest;
  const extensions = body.extensions as Record<string, unknown[]> | undefined;

  if (!manifest?.name || !manifest?.version) {
    return NextResponse.json({ error: "manifest.name and manifest.version required" }, { status: 400 });
  }

  const plugin = await db.Plugin.insert({
    workspaceId: wsId,
    name: manifest.name,
    version: manifest.version,
    author: manifest.author || null,
    description: manifest.description || null,
    iconUrl: manifest.iconUrl || null,
    entryPoint: manifest.entryPoint || null,
    permissions: manifest.permissions || null,
    hooks: manifest.hooks || null,
    enabled: true,
  });

  const pluginId = plugin.id as number;

  if (extensions) {
    for (const [extType, items] of Object.entries(extensions)) {
      const dbType = extensionTypeMap[extType];
      if (!dbType || !Array.isArray(items)) continue;
      for (const item of items) {
        const config = { ...(item as Record<string, unknown>) };
        delete config.name;
        await db.PluginExtension.insert({
          pluginId,
          extensionType: dbType,
          name: (item as Record<string, unknown>).name as string || extType,
          config,
          active: true,
        });
      }
    }
  }

  clearCache(wsId);

  return NextResponse.json(plugin, { status: 201 });
}
