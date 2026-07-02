import type { Workspace } from "./workspace";

export interface UsageRecord {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  entityType: string;
 // @not null
  count: number;
 // @length:10;not null
  period: string;
 // @nullable
  recordedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
