import type { Contact } from "./contact";
import type { Order } from "./order";
import type { Workspace } from "./workspace";

export interface Invoice {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  orderId?: number;
 // @index;not null
  contactId: number;
 // @default:draft;enum:(draft,sent,paid,overdue,cancelled)
  status: string;
 // @not null
  dueDate: string;
  totalAmount: number;
 // @nullable
  paidAt?: string;
 // @nullable;length:500
  pdfUrl?: string;
 // @nullable;length:50
  invoiceNumber?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetoone:Order;foreignKey:orderId
  order?: Order;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
