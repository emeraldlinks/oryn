import type { Plugin } from "./plugin";

export interface PluginExtension {

 // @auto;primaryKey
  id: number;
 // @index;not null
  pluginId: number;
 // @length:50;not null
  extensionType: string;
 // @length:200;not null
  name: string;
 // @json;not null
  config: Record<string, unknown>;
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Plugin;foreignKey:pluginId;onDelete:CASCADE
  plugin?: Plugin;

}
