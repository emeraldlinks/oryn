import type { Employee } from "./employee";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface StaffExpenseReport {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  employeeId: number;
 // @length:300;not null
  title: string;
 // @nullable
  description?: string;
 // @not null
  amount: number;
 // @nullable;length:100
  category?: string;
 // @nullable;length:500
  receiptUrl?: string;
 // @length:20;default:pending
  status?: string;
 // @nullable
  approvedById?: number;
 // @nullable;length:30
  approvedAt?: string;
 // @nullable;length:30
  reimbursedAt?: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
 // @relation manytoone:User;foreignKey:approvedById
  approvedBy?: User;

}
