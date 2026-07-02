import type { AIConversation } from "./aIConversation";
import type { BotConnection } from "./botConnection";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface AIAction {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @nullable;index
  conversationId?: number;
 // @nullable;index
  botConnectionId?: number;
 // @length:200;not null
  actionType: string;
 // @json;not null
  actionPayload: Record<string, unknown>;
 // @json;nullable
  result?: Record<string, unknown>;
 // @default:pending;enum:(pending,completed,failed)
  status: string;
 // @nullable
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;
 // @relation manytoone:AIConversation;foreignKey:conversationId
  conversation?: AIConversation;
 // @relation manytoone:BotConnection;foreignKey:botConnectionId
  botConnection?: BotConnection;

}
