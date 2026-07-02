import type { Workspace } from "./workspace";

export interface InventoryBrand {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable;length:200
  slug?: string;
 // @nullable
  description?: string;
 // @nullable;length:500
  logoUrl?: string;
 // @nullable;length:500
  website?: string;
 // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
