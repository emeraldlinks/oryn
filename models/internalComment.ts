import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface InternalComment {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @length:100;not null
  entityType: string;
 // @index;not null
  entityId: number;
  bodyHtml: string;
 // @json;nullable
  mentions?: number[];
 // @nullable
  editedAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
