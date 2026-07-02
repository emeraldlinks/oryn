import type { Subscription } from "./subscription";
import type { Workspace } from "./workspace";

export interface SubscriptionPlan {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @unique;length:200;not null
  name: string;
 // @nullable
  description?: string;
  price: number;
 // @default:USD;length:3
  currency: string;
 // @length:20;not null
  billingCycle: string;
 // @json;nullable
  features?: string[];
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:Subscription;foreignKey:planId
  subscriptions?: Subscription[];

}
