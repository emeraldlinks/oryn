import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface SalesGoal {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
  targetAmount: number;
 // @length:20;not null
  period: string;
 // @length:20;not null
  periodType: string;
 // @default:USD;length:3
  currency: string;
 // @default:0
  achievedAmount: number;
 // @nullable
  startDate?: string;
 // @nullable
  endDate?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
