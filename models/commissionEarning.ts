import type { CommissionPlan } from "./commissionPlan";
import type { Deal } from "./deal";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface CommissionEarning {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @index;not null
  dealId: number;
 // @index;not null
  planId: number;
  amount: number;
 // @default:pending;enum:(pending,approved,paid,cancelled)
  status: string;
 // @nullable
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;
 // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;
 // @relation manytoone:CommissionPlan;foreignKey:planId
  plan?: CommissionPlan;

}
