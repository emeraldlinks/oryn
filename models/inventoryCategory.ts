import type { Workspace } from "./workspace";

export interface InventoryCategory {

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
 // @nullable;index
  parentId?: number;
 // @nullable;length:500
  imageUrl?: string;
 // @nullable;default:0
  sortOrder?: number;
 // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryCategory;foreignKey:parentId
  parent?: InventoryCategory;
 // @relation onetomany:InventoryCategory;foreignKey:parentId
  children?: InventoryCategory[];

}
