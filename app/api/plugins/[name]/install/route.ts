import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { executePluginHook } from "@/lib/plugin-system";

const extensionTypes = ["pages", "actions", "models", "webhooks", "aiTools", "widgets"] as const;

function extensionTypeToDbType(extType: string): string {
  const map: Record<string, string> = {
    pages: "page",
    actions: "action",
    models: "model",
    webhooks: "webhook",
    aiTools: "ai_tool",
    widgets: "widget",
  };
  return map[extType] || extType;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const body = await req.json();
  const { manifestUrl, manifest } = body;

  let resolvedManifest: Record<string, unknown>;
  if (manifestUrl) {
    const placeholderName = manifestUrl.split("/").pop()?.replace(/\.json$/, "") || "remote-plugin";
    resolvedManifest = { name: placeholderName, version: "1.0.0", ...manifest };
  } else if (manifest) {
    resolvedManifest = manifest;
  } else {
    return NextResponse.json({ error: "manifest or manifestUrl required" }, { status: 400 });
  }

  const existing = await db.Plugin.where("workspaceId")
    .equals(wsId)
    .and((p: { name: string }) => p.name === resolvedManifest.name)
    .first();

  let plugin: Record<string, unknown>;
  const pluginData = {
    workspaceId: wsId,
    name: resolvedManifest.name as string,
    version: resolvedManifest.version as string,
    author: (resolvedManifest.author as string) || null,
    description: (resolvedManifest.description as string) || null,
    iconUrl: (resolvedManifest.iconUrl as string) || null,
    entryPoint: (resolvedManifest.entryPoint as string) || null,
    permissions: (resolvedManifest.permissions as string[]) || null,
    hooks: (resolvedManifest.hooks as Record<string, string>) || null,
    enabled: true,
  };

  if (existing) {
    await db.Plugin.update({ id: existing.id, workspaceId: wsId }, pluginData);
    plugin = { ...pluginData, id: existing.id };
  } else {
    plugin = await db.Plugin.insert(pluginData);
  }

  const pluginId = plugin.id as number;

  const rawExtensions: Record<string, unknown[]> = {};
  for (const key of extensionTypes) {
    if (body[key]) rawExtensions[key] = body[key];
  }

  for (const [extType, items] of Object.entries(rawExtensions)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const config = { ...(item as Record<string, unknown>) };
      delete config.name;
      await db.PluginExtension.insert({
        pluginId,
        extensionType: extensionTypeToDbType(extType),
        name: (item as Record<string, unknown>).name as string || extType,
        config,
        active: true,
      });
    }
  }

  await executePluginHook(wsId, resolvedManifest.name as string, "onInstall");

  return NextResponse.json(plugin, { status: 201 });
}
