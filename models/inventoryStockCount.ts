import type { Workspace } from "./workspace";
import type { InventoryWarehouse } from "./inventoryWarehouse";
import type { User } from "./user";

export interface InventoryStockCount {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  warehouseId: number;
 // @length:30;default:CURRENT_TIMESTAMP
  countDate: string;
 // @length:30;default:draft
  status: string;
 // @nullable
  createdById?: number;
 // @nullable
  verifiedById?: number;
 // @nullable;length:30
  verifiedAt?: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryWarehouse;foreignKey:warehouseId
  warehouse?: InventoryWarehouse;
 // @relation manytoone:User;foreignKey:createdById
  createdBy?: User;
 // @relation manytoone:User;foreignKey:verifiedById
  verifiedBy?: User;

}
