import type { Workspace } from "./workspace";

export interface DataRetentionPolicy {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  entityType: string;
 // @not null
  retentionDays: number;
 // @length:50;not null;default:delete
  action: string;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
