import { initDb } from "@/lib/db";
import { pluginRegistry } from "./registry";

export async function dispatchToPluginWebhooks(
  workspaceId: number,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const webhooks = pluginRegistry.getWebhooksByEvent(workspaceId, event);
  if (webhooks.length === 0) return;

  const db = await initDb();
  const requestBody = JSON.stringify(payload);

  for (const wh of webhooks) {
    await db.BackgroundJob.insert({
      workspaceId,
      type: "plugin_webhook_delivery",
      status: "pending",
      payload: {
        webhookName: wh.name,
        pluginId: wh.pluginId,
        url: wh.config.url,
        headers: wh.config.headers || {},
        retryCount: wh.config.retryCount ?? 3,
        event,
        requestBody,
      },
      maxAttempts: wh.config.retryCount ?? 3,
      createdAt: new Date().toISOString(),
    });

    await db.WebhookDelivery.insert({
      workspaceId,
      endpointId: wh.id,
      status: "pending",
      httpStatus: 0,
      requestBody,
      requestHeaders: wh.config.headers ? JSON.parse(JSON.stringify(wh.config.headers)) : {},
      createdAt: new Date().toISOString(),
    });
  }
}
