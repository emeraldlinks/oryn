import { db } from "@/lib/db";

export type PluginHookType = "onInstall" | "onUninstall" | "onActivate" | "onDeactivate";

export async function executePluginHook(
  workspaceId: number,
  pluginName: string,
  hook: PluginHookType
): Promise<{ success: boolean; error?: string }> {
  try {
    const plugin = await db.Plugin.where("workspaceId")
      .equals(workspaceId)
      .and((p: { name: string }) => p.name === pluginName)
      .first();

    if (!plugin) {
      return { success: false, error: `Plugin "${pluginName}" not found` };
    }

    const manifest = {
      hooks: plugin.hooks as Record<string, string> | undefined,
    };

    if (!manifest.hooks || !manifest.hooks[hook]) {
      return { success: true };
    }

    await db.BackgroundJob.add({
      type: "plugin_hook",
      status: "pending",
      payload: {
        workspaceId,
        pluginId: plugin.id,
        pluginName,
        hook,
        handlerUrl: manifest.hooks[hook],
      },
      createdAt: new Date(),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export async function runPluginLifecycle(
  workspaceId: number,
  pluginId: number,
  hook: PluginHookType
): Promise<void> {
  const plugin = await db.Plugin.get(pluginId);

  if (!plugin) {
    console.warn(`[Plugin Lifecycle] Plugin ${pluginId} not found`);
    return;
  }

  await executePluginHook(workspaceId, plugin.name, hook);
}
