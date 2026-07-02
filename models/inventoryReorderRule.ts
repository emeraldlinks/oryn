import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryVariant } from "./inventoryVariant";
import type { InventoryWarehouse } from "./inventoryWarehouse";

export interface InventoryReorderRule {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  itemId: number;
 // @nullable;index
  variantId?: number;
 // @nullable;index
  warehouseId?: number;
 // @default:0
  minQuantity: number;
 // @default:0
  maxQuantity: number;
 // @default:0
  reorderPoint: number;
 // @default:0
  reorderQuantity: number;
 // @nullable;default:0
  leadTimeDays?: number;
 // @default:true
  isActive: boolean;
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
