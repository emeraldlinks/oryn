import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryVariant } from "./inventoryVariant";
import type { InventoryWarehouse } from "./inventoryWarehouse";

export interface InventoryStock {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  itemId: number;
 // @nullable;index
  variantId?: number;
 // @index;not null
  warehouseId: number;
 // @default:0
  quantity: number;
 // @default:0
  reservedQuantity: number;
 // @default:0
  availableQuantity: number;
 // @nullable;length:100
  location?: string;
 // @nullable;length:50
  bin?: string;
 // @nullable;length:50
  shelf?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryItem;foreignKey:itemId
  item?: InventoryItem;
 // @relation manytoone:InventoryVariant;foreignKey:variantId
  variant?: InventoryVariant;
 // @relation manytoone:InventoryWarehouse;foreignKey:warehouseId
  warehouse?: InventoryWarehouse;

}
