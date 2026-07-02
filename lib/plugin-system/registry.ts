import { initDb } from "@/lib/db";
import type { PluginAITool, PluginAction, PluginInstance, PluginManifest, PluginModel, PluginPage, PluginWebhook, PluginWidget } from "./types";
import type { ExtensionType } from "./types";

type Cache = Map<number, Map<string, PluginInstance>>;

const cache: Cache = new Map();

function getOrCreateWorkspaceMap(workspaceId: number): Map<string, PluginInstance> {
  let wsMap = cache.get(workspaceId);
  if (!wsMap) {
    wsMap = new Map();
    cache.set(workspaceId, wsMap);
  }
  return wsMap;
}

export async function loadWorkspacePlugins(workspaceId: number): Promise<PluginInstance[]> {
  const db = await initDb();
  const plugins = await db.Plugin.where("workspaceId")
    .equals(workspaceId)
    .and((p: { enabled: boolean }) => p.enabled === true)
    .toArray();

  const wsMap = getOrCreateWorkspaceMap(workspaceId);

  for (const plugin of plugins) {
    const extensions = await db.PluginExtension.where("pluginId")
      .equals(plugin.id)
      .toArray();

    const manifest: PluginManifest = {
      name: plugin.name,
      version: plugin.version,
      author: plugin.author,
      description: plugin.description,
      iconUrl: plugin.iconUrl,
      entryPoint: plugin.entryPoint,
      permissions: plugin.permissions,
      hooks: plugin.hooks,
    };

    const pages: PluginPage[] = [];
    const actions: PluginAction[] = [];
    const models: PluginModel[] = [];
    const webhooks: PluginWebhook[] = [];
    const aiTools: PluginAITool[] = [];
    const widgets: PluginWidget[] = [];

    for (const ext of extensions) {
      const config = typeof ext.config === "string" ? JSON.parse(ext.config) : ext.config;
      const base = { id: ext.id, pluginId: plugin.id, name: ext.name };

      switch (ext.type as ExtensionType) {
        case "page":
          pages.push({ ...base, route: config.route ?? "", config });
          break;
        case "action":
          actions.push({ ...base, config });
          break;
        case "model":
          models.push({ ...base, config });
          break;
        case "webhook":
          webhooks.push({ ...base, config });
          break;
        case "ai_tool":
          aiTools.push({ ...base, config });
          break;
        case "widget":
          widgets.push({ ...base, config });
          break;
      }
    }

    const instance: PluginInstance = {
      id: plugin.id,
      manifest,
      enabled: plugin.enabled,
      pages,
      actions,
      models,
      webhooks,
      aiTools,
      widgets,
    };

    wsMap.set(plugin.name, instance);
  }

  return Array.from(wsMap.values());
}

export function getPlugins(workspaceId: number): PluginInstance[] {
  const wsMap = cache.get(workspaceId);
  return wsMap ? Array.from(wsMap.values()) : [];
}

export function getPlugin(workspaceId: number, name: string): PluginInstance | undefined {
  const wsMap = cache.get(workspaceId);
  return wsMap?.get(name);
}

export function getExtensionsByType<T>(
  workspaceId: number,
  type: ExtensionType
): T[] {
  const plugins = getPlugins(workspaceId);
  const results: T[] = [];

  for (const plugin of plugins) {
    switch (type) {
      case "page":
        results.push(...(plugin.pages as unknown as T[]));
        break;
      case "action":
        results.push(...(plugin.actions as unknown as T[]));
        break;
      case "model":
        results.push(...(plugin.models as unknown as T[]));
        break;
      case "webhook":
        results.push(...(plugin.webhooks as unknown as T[]));
        break;
      case "ai_tool":
        results.push(...(plugin.aiTools as unknown as T[]));
        break;
      case "widget":
        results.push(...(plugin.widgets as unknown as T[]));
        break;
    }
  }

  return results;
}

export function getActions(workspaceId: number): PluginAction[] {
  return getExtensionsByType<PluginAction>(workspaceId, "action");
}

export function getAITools(workspaceId: number): PluginAITool[] {
  return getExtensionsByType<PluginAITool>(workspaceId, "ai_tool");
}

export function getWidgets(workspaceId: number): PluginWidget[] {
  return getExtensionsByType<PluginWidget>(workspaceId, "widget");
}

export function getPages(workspaceId: number): PluginPage[] {
  return getExtensionsByType<PluginPage>(workspaceId, "page");
}

export function getModels(workspaceId: number): PluginModel[] {
  return getExtensionsByType<PluginModel>(workspaceId, "model");
}

export function getWebhooksByEvent(workspaceId: number, event: string): PluginWebhook[] {
  return getExtensionsByType<PluginWebhook>(workspaceId, "webhook").filter(
    (wh) => wh.config.events.includes(event)
  );
}

export function clearCache(workspaceId?: number): void {
  if (workspaceId !== undefined) {
    cache.delete(workspaceId);
  } else {
    cache.clear();
  }
}
