export type ExtensionType = "page" | "model" | "action" | "webhook" | "ai_tool" | "widget";

export interface PluginManifest {
  name: string;
  version: string;
  author?: string;
  description?: string;
  iconUrl?: string;
  entryPoint?: string;
  permissions?: string[];
  hooks?: {
    onInstall?: string;
    onUninstall?: string;
    onActivate?: string;
    onDeactivate?: string;
  };
}

export interface PluginPage {
  id: number;
  pluginId: number;
  name: string;
  route: string;
  config: {
    url?: string;
    iframe?: boolean;
    sidebarLabel?: string;
    sidebarIcon?: string;
    requires?: string[];
  };
}

export interface PluginAction {
  id: number;
  pluginId: number;
  name: string;
  config: {
    label: string;
    description?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params?: Record<string, unknown>;
    webhookUrl?: string;
    handler?: string;
  };
}

export interface PluginModel {
  id: number;
  pluginId: number;
  name: string;
  config: {
    entity: string;
    fields: PluginFieldDef[];
    relationships?: PluginRelationDef[];
  };
}

export interface PluginFieldDef {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "select" | "json";
  label: string;
  required?: boolean;
  options?: string[];
  defaultValue?: unknown;
  description?: string;
}

export interface PluginRelationDef {
  type: "hasMany" | "belongsTo" | "hasOne";
  model: string;
  foreignKey: string;
}

export interface PluginWebhook {
  id: number;
  pluginId: number;
  name: string;
  config: {
    events: string[];
    url: string;
    headers?: Record<string, string>;
    retryCount?: number;
  };
}

export interface PluginAITool {
  id: number;
  pluginId: number;
  name: string;
  config: {
    label: string;
    description: string;
    parameters: AIToolParam[];
    handler: string;
  };
}

export interface AIToolParam {
  name: string;
  type: "string" | "number" | "boolean" | "select";
  label: string;
  required?: boolean;
  options?: string[];
  description?: string;
}

export interface PluginWidget {
  id: number;
  pluginId: number;
  name: string;
  config: {
    label: string;
    description?: string;
    type: "chart" | "metric" | "table" | "custom";
    chartType?: "bar" | "line" | "pie" | "area";
    query?: string;
    refreshInterval?: number;
    size?: "sm" | "md" | "lg" | "xl";
    defaultConfig?: Record<string, unknown>;
  };
}

export interface PluginInstance {
  id: number;
  manifest: PluginManifest;
  enabled: boolean;
  pages: PluginPage[];
  actions: PluginAction[];
  models: PluginModel[];
  webhooks: PluginWebhook[];
  aiTools: PluginAITool[];
  widgets: PluginWidget[];
}

export interface PluginActionResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
