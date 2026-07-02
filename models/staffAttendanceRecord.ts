import type { Employee } from "./employee";
import type { Workspace } from "./workspace";

export interface StaffAttendanceRecord {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @index;not null
  employeeId: number;
  // @length:10;not null
  date: string;
  // @length:20;default:'present'
  status: string;
  // @nullable;length:5
  clockIn?: string;
  // @nullable;length:5
  clockOut?: string;
  // @nullable;default:0
  lateMinutes?: number;
  // @nullable;default:0
  earlyDepartureMinutes?: number;
  // @default:false
  isExcused: boolean;
  // @nullable
  reason?: string;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;

}
