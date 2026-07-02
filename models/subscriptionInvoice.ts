import type { Invoice } from "./invoice";
import type { Subscription } from "./subscription";

export interface SubscriptionInvoice {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  subscriptionId: number;
 // @index;not null
  invoiceId: number;
 // @not null
  periodStart: string;
 // @not null
  periodEnd: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Subscription;foreignKey:subscriptionId;onDelete:CASCADE
  subscription?: Subscription;
 // @relation manytoone:Invoice;foreignKey:invoiceId
  invoice?: Invoice;

}
