import type { Contact } from "./contact";
import type { SubscriptionInvoice } from "./subscriptionInvoice";
import type { SubscriptionPlan } from "./subscriptionPlan";
import type { Workspace } from "./workspace";

export interface Subscription {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @index;not null
  planId: number;
 // @default:active;enum:(active,paused,cancelled,expired,trialing)
  status: string;
 // @not null
  startDate: string;
 // @nullable
  endDate?: string;
 // @nullable
  nextBillingDate?: string;
 // @default:0
  amount: number;
 // @default:USD;length:3
  currency: string;
 // @nullable
  cancelledAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:SubscriptionPlan;foreignKey:planId
  plan?: SubscriptionPlan;
 // @relation onetomany:SubscriptionInvoice;foreignKey:subscriptionId
  invoices?: SubscriptionInvoice[];

}
