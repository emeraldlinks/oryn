import type { Workspace } from "./workspace";

export interface CustomFieldDef {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @enum:(contact,deal,ticket,order,product,lead);not null
  entityType: string;
 // @length:100;not null
  fieldName: string;
 // @length:50;not null
  fieldType: string;
 // @nullable;json
  options?: string[];
 // @default:false
  required: boolean;
 // @default:0
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
