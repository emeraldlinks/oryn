import type { Employee } from "./employee";
import type { StaffLeaveType } from "./staffLeaveType";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface StaffLeaveRequest {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @index;not null
  employeeId: number;
  // @nullable;index
  leaveTypeId?: number;
  // @length:10;not null
  startDate: string;
  // @length:10;not null
  endDate: string;
  // @default:0
  totalDays: number;
  // @nullable
  reason?: string;
  // @length:20;default:'pending'
  status: string;
  // @nullable;index
  approvedById?: number;
  // @nullable;length:30
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
  // @relation manytoone:StaffLeaveType;foreignKey:leaveTypeId
  leaveType?: StaffLeaveType;
  // @relation manytoone:User;foreignKey:approvedById
  approvedBy?: User;

}
