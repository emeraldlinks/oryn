import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Expense {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  description: string;
  amount: number;
 // @default:USD;length:3
  currency: string;
 // @length:100;not null
  category: string;
 // @not null
  expenseDate: string;
 // @nullable;index
  userId?: number;
 // @nullable
  receiptUrl?: string;
 // @nullable
  reimbursedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
