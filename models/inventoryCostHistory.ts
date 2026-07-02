import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryVariant } from "./inventoryVariant";
import type { User } from "./user";

export interface InventoryCostHistory {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  itemId: number;
 // @nullable;index
  variantId?: number;
 // @nullable
  oldCost?: number;
 // @not null
  newCost: number;
 // @nullable
  changedById?: number;
 // @nullable;length:200
  reason?: string;
 // @nullable;length:100
  reference?: string;
 // @nullable
  referenceId?: number;
 // @length:30
  createdAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryItem;foreignKey:itemId
  item?: InventoryItem;
 // @relation manytoone:InventoryVariant;foreignKey:variantId
  variant?: InventoryVariant;
 // @relation manytoone:User;foreignKey:changedById
  changedBy?: User;

}
