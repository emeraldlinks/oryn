import type { Workspace } from "./workspace";

export interface InventoryWarehouse {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:50;not null;unique
  code: string;
 // @nullable
  address?: string;
 // @nullable;length:100
  city?: string;
 // @nullable;length:100
  state?: string;
 // @nullable;length:100
  country?: string;
 // @nullable;length:30
  phone?: string;
 // @nullable;length:200
  email?: string;
 // @default:true
  isActive: boolean;
 // @default:false
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
