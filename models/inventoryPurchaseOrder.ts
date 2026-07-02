import type { Workspace } from "./workspace";
import type { InventorySupplier } from "./inventorySupplier";
import type { User } from "./user";

export interface InventoryPurchaseOrder {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  supplierId: number;
 // @length:50;not null;unique
  orderNumber: string;
 // @length:30;default:draft
  status: string;
 // @length:30;default:CURRENT_TIMESTAMP
  orderDate: string;
 // @nullable;length:30
  expectedDate?: string;
 // @nullable;length:30
  deliveredDate?: string;
 // @default:0.00
  subtotal: number;
 // @default:0.00
  tax: number;
 // @default:0.00
  shipping: number;
 // @default:0.00
  totalAmount: number;
 // @length:3;default:USD
  currency: string;
 // @nullable
  notes?: string;
 // @nullable
  createdById?: number;
 // @nullable
  approvedById?: number;
 // @nullable;length:30
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventorySupplier;foreignKey:supplierId
  supplier?: InventorySupplier;
 // @relation manytoone:User;foreignKey:createdById
  createdBy?: User;
 // @relation manytoone:User;foreignKey:approvedById
  approvedBy?: User;

}
