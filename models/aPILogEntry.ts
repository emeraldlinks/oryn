import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface APILogEntry {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  userId?: number;
 // @length:20;not null
  method: string;
 // @length:500;not null
  path: string;
 // @not null
  statusCode: number;
 // @nullable
  durationMs?: number;
 // @nullable;length:50
  ipAddress?: string;
 // @nullable
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
