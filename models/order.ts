import type { Contact } from "./contact";
import type { Invoice } from "./invoice";
import type { OrderItem } from "./orderItem";
import type { Workspace } from "./workspace";

export interface Order {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @default:pending;enum:(pending,confirmed,processing,shipped,delivered,cancelled,refunded)
  status: string;
  totalAmount: number;
 // @default:USD;length:3
  currency: string;
 // @nullable
  paidAt?: string;
 // @nullable;index
  branchId?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation onetomany:OrderItem;foreignKey:orderId
  items?: OrderItem[];
 // @relation onetoone:Invoice;foreignKey:orderId
  invoice?: Invoice;

}
