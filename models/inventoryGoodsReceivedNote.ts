import type { Workspace } from "./workspace";
import type { InventoryPurchaseOrder } from "./inventoryPurchaseOrder";
import type { InventorySupplier } from "./inventorySupplier";
import type { InventoryWarehouse } from "./inventoryWarehouse";
import type { User } from "./user";

export interface InventoryGoodsReceivedNote {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  poId?: number;
 // @nullable;index
  supplierId?: number;
 // @index;not null
  warehouseId: number;
 // @length:50;not null;unique
  receiptNumber: string;
 // @length:30;default:CURRENT_TIMESTAMP
  receivedDate: string;
 // @length:30;default:draft
  status: string;
 // @nullable
  notes?: string;
 // @nullable
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryPurchaseOrder;foreignKey:poId
  purchaseOrder?: InventoryPurchaseOrder;
 // @relation manytoone:InventorySupplier;foreignKey:supplierId
  supplier?: InventorySupplier;
 // @relation manytoone:InventoryWarehouse;foreignKey:warehouseId
  warehouse?: InventoryWarehouse;
 // @relation manytoone:User;foreignKey:createdById
  createdBy?: User;

}
