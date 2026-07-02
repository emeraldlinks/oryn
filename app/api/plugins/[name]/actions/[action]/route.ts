import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";
import {
  loadWorkspacePlugins,
  getPlugin,
  type PluginActionResponse,
} from "@/lib/plugin-system";

export async function POST(
  req: Request,
  { params }: { params: { name: string; action: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const pluginName = params.name;
  const actionName = params.action;

  const existingPlugins = getPlugin(wsId, pluginName);
  if (!existingPlugins) {
    await loadWorkspacePlugins(wsId);
  }

  const plugin = getPlugin(wsId, pluginName);
  if (!plugin) {
    return NextResponse.json({ error: `Plugin "${pluginName}" not found` }, { status: 404 });
  }

  const action = plugin.actions.find((a) => a.name === actionName);
  if (!action) {
    return NextResponse.json({ error: `Action "${actionName}" not found` }, { status: 404 });
  }

  const body = await req.json();

  let result: PluginActionResponse;

  if (action.config.webhookUrl) {
    try {
      const webhookResponse = await fetch(action.config.webhookUrl, {
        method: action.config.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = webhookResponse.ok ? await webhookResponse.json().catch(() => null) : null;
      result = {
        success: webhookResponse.ok,
        data: data || undefined,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result = { success: false, error: message };
    }
  } else {
    result = { success: true, data: { message: `Action "${actionName}" executed` } };
  }

  await db.BackgroundJob.add({
    type: "plugin_action",
    status: result.success ? "completed" : "failed",
    payload: {
      workspaceId: wsId,
      pluginId: plugin.id,
      pluginName,
      actionName,
      input: body,
      output: result,
    },
    result: result.success ? { data: result.data } : undefined,
    errorMessage: result.success ? undefined : result.error,
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
