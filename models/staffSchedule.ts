import type { Employee } from "./employee";
import type { StaffShift } from "./staffShift";
import type { Workspace } from "./workspace";

export interface StaffSchedule {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @index;not null
  employeeId: number;
  // @nullable;index
  shiftId?: number;
  // @length:10;not null
  startDate: string;
  // @nullable;length:10
  endDate?: string;
  // @default:false
  isRecurring: boolean;
  // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
  // @relation manytoone:StaffShift;foreignKey:shiftId
  shift?: StaffShift;

}
