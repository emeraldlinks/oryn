import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Territory {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @json;nullable
  regions?: Record<string, unknown>;
 // @nullable;index
  managerId?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:managerId
  manager?: User;

}
