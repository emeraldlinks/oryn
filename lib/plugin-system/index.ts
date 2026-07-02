export * from "./types";
export * from "./registry";
export * from "./hooks";
export * from "./permissions";

import {
  getPlugins,
  getPlugin,
  getActions,
  getAITools,
  getWidgets,
  getPages,
  getWebhooksByEvent,
  getModels,
  loadWorkspacePlugins,
  clearCache,
} from "./registry";

export const pluginRegistry = {
  getPlugins,
  getPlugin,
  getActions,
  getAITools,
  getWidgets,
  getPages,
  getWebhooksByEvent,
  getModels,
  loadWorkspacePlugins,
  clearCache,
};
