import type { Invoice } from "./invoice";
import type { Workspace } from "./workspace";

export interface Refund {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  invoiceId: number;
  amount: number;
 // @default:USD;length:3
  currency: string;
 // @length:100;not null
  reason: string;
 // @default:pending;enum:(pending,approved,rejected,processed)
  status: string;
 // @nullable
  processedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Invoice;foreignKey:invoiceId
  invoice?: Invoice;

}
