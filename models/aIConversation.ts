import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface AIConversation {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @length:200;not null
  title: string;
 // @json;not null
  messages: Record<string, unknown>;
 // @length:50;not null
  provider: string;
 // @default:active;enum:(active,archived)
  status: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
