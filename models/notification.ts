import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Notification {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @length:50;not null
  type: string;
 // @length:200;not null
  title: string;
  body: string;
 // @nullable
  readAt?: string;
 // @nullable;json
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
