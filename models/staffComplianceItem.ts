import type { Workspace } from "./workspace";

export interface StaffComplianceItem {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:300;not null
  name: string;
 // @nullable
  description?: string;
 // @length:50;default:training
  category?: string;
 // @nullable;length:50
  frequency?: string;
 // @default:true
  isMandatory?: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
