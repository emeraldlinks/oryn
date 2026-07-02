import type { Workspace } from "./workspace";

export interface Bot {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  name: string;
 // @enum:(chat,email,social,slack,whatsapp);not null
  channel: string;
 // @length:255;not null
  triggerKeywords: string;
 // @length:500;not null
  responseTemplate: string;
 // @enum:(openai,gemini,deepseek,claude,qwen,kimi,keyword);default:keyword
  aiModel: string;
 // @json;nullable
  config?: Record<string, unknown>;
 // @default:true
  active: boolean;
 // @default:0
  totalConversations: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
