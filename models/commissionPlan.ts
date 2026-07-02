import type { Workspace } from "./workspace";

export interface CommissionPlan {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:20;not null
  rateType: string;
  rateValue: number;
 // @nullable
  minDealValue?: number;
 // @nullable
  maxDealValue?: number;
 // @nullable;json
  tiers?: Record<string, unknown>;
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
