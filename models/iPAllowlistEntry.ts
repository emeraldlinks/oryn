import type { Workspace } from "./workspace";

export interface IPAllowlistEntry {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:50;not null
  ipAddress: string;
 // @nullable;length:200
  description?: string;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
