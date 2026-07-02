import type { Employee } from "./employee";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface StaffTimesheet {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @index;not null
  employeeId: number;
  // @length:10;not null
  date: string;
  // @nullable;length:5
  clockIn?: string;
  // @nullable;length:5
  clockOut?: string;
  // @nullable;default:0
  breakDuration?: number;
  // @nullable
  totalHours?: number;
  // @nullable;default:0
  overtimeHours?: number;
  // @length:20;default:'draft'
  status: string;
  // @nullable;index
  approvedById?: number;
  // @nullable;length:30
  approvedAt?: string;
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
