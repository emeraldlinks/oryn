import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryWarehouse } from "./inventoryWarehouse";

export interface InventoryBatch {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  itemId: number;
 // @length:100;not null
  batchNumber: string;
 // @nullable;length:10
  manufacturerDate?: string;
 // @nullable;length:10
  expiryDate?: string;
 // @default:0
  quantity: number;
 // @nullable;index
  warehouseId?: number;
 // @nullable
  cost?: number;
 // @length:20;default:active
  status: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryItem;foreignKey:itemId
  item?: InventoryItem;
 // @relation manytoone:InventoryWarehouse;foreignKey:warehouseId
  warehouse?: InventoryWarehouse;

}
