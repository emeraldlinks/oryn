import type { Workspace } from "./workspace";
import type { InventorySupplier } from "./inventorySupplier";
import type { User } from "./user";

export interface InventoryReturn {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  supplierId: number;
 // @length:50;not null;unique
  returnNumber: string;
 // @length:30;default:CURRENT_TIMESTAMP
  returnDate: string;
 // @length:30;default:draft
  status: string;
 // @nullable
  reason?: string;
 // @default:0.00
  totalAmount: number;
 // @nullable
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventorySupplier;foreignKey:supplierId
  supplier?: InventorySupplier;
 // @relation manytoone:User;foreignKey:createdById
  createdBy?: User;

}
