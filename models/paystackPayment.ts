import type { Invoice } from "./invoice";
import type { Workspace } from "./workspace";

export interface PaystackPayment {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  invoiceId: number;
 // @length:200;not null
  reference: string;
 // @length:200;nullable
  accessCode?: string;
 // @length:50;not null;default:pending;enum:(pending,success,failed,abandoned)
  status: string;
 // @nullable
  amount: number;
 // @length:3;default:NGN
  currency: string;
 // @nullable;json
  gatewayResponse?: string;
 // @nullable
  paidAt?: string;
 // @nullable;length:200
  authorizationUrl?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Invoice;foreignKey:invoiceId
  invoice?: Invoice;

}
