import type { Workspace } from "./workspace";
import type { InventoryPurchaseOrder } from "./inventoryPurchaseOrder";
import type { InventoryItem } from "./inventoryItem";
import type { InventoryVariant } from "./inventoryVariant";

export interface InventoryPurchaseOrderItem {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  poId: number;
 // @index;not null
  itemId: number;
 // @nullable;index
  variantId?: number;
 // @not null
  quantity: number;
 // @not null
  unitCost: number;
 // @not null
  totalCost: number;
 // @default:0
  quantityReceived: number;
 // @default:0
  quantityOutstanding: number;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryPurchaseOrder;foreignKey:poId
  purchaseOrder?: InventoryPurchaseOrder;
 // @relation manytoone:InventoryItem;foreignKey:itemId
  item?: InventoryItem;
 // @relation manytoone:InventoryVariant;foreignKey:variantId
  variant?: InventoryVariant;

}
