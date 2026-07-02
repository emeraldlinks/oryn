import type { Workspace } from "./workspace";

export interface LiveChatSettings {

 // @auto;primaryKey
  id: number;
 // @unique;not null
  workspaceId: number;
 // @default:true
  enabled: boolean;
 // @nullable
  widgetColor?: string;
 // @nullable;length:200
  welcomeMessage?: string;
 // @nullable
  awayMessage?: string;
 // @default:false
  collectEmail: boolean;
 // @default:true
  showAgentNames: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation onetoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
