import type { Bot } from "./bot";
import type { Workspace } from "./workspace";

export interface WidgetSettings {

 // @auto;primaryKey
  id: number;
 // @unique;index;not null
  workspaceId: number;
 // @default:true
  enabled: boolean;
 // @length:10;default:#6366f1
  primaryColor: string;
 // @length:200;nullable
  welcomeMessage?: string;
 // @length:200;nullable
  awayMessage?: string;
 // @default:false
  collectEmail: boolean;
 // @default:true
  showAgentNames: boolean;
 // @default:false
  enableBots: boolean;
 // @nullable;index
  defaultBotId?: number;
 // @json;nullable
  allowedDomains?: string[];
 // @length:500;nullable
  customCss?: string;
 // @length:100;nullable
  position?: string;
  createdAt: string;
  updatedAt: string;

 // @relation onetoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Bot;foreignKey:defaultBotId
  defaultBot?: Bot;

}
