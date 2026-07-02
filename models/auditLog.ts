import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface AuditLog {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  userId?: number;
 // @length:50;not null
  action: string;
 // @length:50;not null
  entity: string;
 // @nullable;index
  entityId?: number;
 // @nullable;json
  meta?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
