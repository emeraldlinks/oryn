import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryVariant } from "./inventoryVariant";
import type { InventoryWarehouse } from "./inventoryWarehouse";
import type { User } from "./user";

export interface InventoryStockTransfer {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  itemId: number;
 // @nullable;index
  variantId?: number;
 // @index;not null
  fromWarehouseId: number;
 // @index;not null
  toWarehouseId: number;
 // @not null
  quantity: number;
 // @length:30;default:draft
  status: string;
 // @nullable
  transferredById?: number;
 // @nullable
  receivedById?: number;
 // @nullable;length:30
  transferredAt?: string;
 // @nullable;length:30
  receivedAt?: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryItem;foreignKey:itemId
  item?: InventoryItem;
 // @relation manytoone:InventoryVariant;foreignKey:variantId
  variant?: InventoryVariant;
 // @relation manytoone:InventoryWarehouse;foreignKey:fromWarehouseId
  fromWarehouse?: InventoryWarehouse;
 // @relation manytoone:InventoryWarehouse;foreignKey:toWarehouseId
  toWarehouse?: InventoryWarehouse;
 // @relation manytoone:User;foreignKey:transferredById
  transferredBy?: User;
 // @relation manytoone:User;foreignKey:receivedById
  receivedBy?: User;

}
