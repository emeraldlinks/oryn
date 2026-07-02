import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryVariant } from "./inventoryVariant";
import type { InventoryWarehouse } from "./inventoryWarehouse";
import type { User } from "./user";

export interface InventoryMovement {

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
 // @length:30;not null
  type: string;
 // @not null
  quantity: number;
 // @nullable;length:50
  reference?: string;
 // @nullable
  referenceId?: number;
 // @nullable
  unitCost?: number;
 // @nullable
  totalCost?: number;
 // @nullable
  notes?: string;
 // @nullable
  performedById?: number;
 // @length:30;default:CURRENT_TIMESTAMP
  performedAt: string;
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
 // @relation manytoone:User;foreignKey:performedById
  performedBy?: User;

}
