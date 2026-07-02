import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface AIApiKey {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  userId?: number;
 // @enum:(openai,gemini,deepseek,claude,qwen,kimi,nvidia,opencode);not null
  provider: string;
 // @not null
  apiKey: string;
 // @default:user;enum:(user,workspace)
  scope: string;
 // @default:true
  active: boolean;
 // @nullable
  lastUsedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
