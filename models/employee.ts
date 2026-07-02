import type { Attendance } from "./attendance";
import type { Branch } from "./branch";
import type { LeaveRequest } from "./leaveRequest";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Employee {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @unique;index;not null
  userId: number;
 // @nullable;index
  branchId?: number;
 // @nullable;length:100
  department?: string;
 // @nullable;length:100
  jobTitle?: string;
 // @nullable
  salary?: number;
 // @nullable
  startDate?: string;
  createdAt: string;
  updatedAt: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;
 // @relation manytoone:Branch;foreignKey:branchId
  branch?: Branch;
 // @relation onetomany:Attendance;foreignKey:employeeId
  attendance?: Attendance[];
 // @relation onetomany:LeaveRequest;foreignKey:employeeId
  leaveRequests?: LeaveRequest[];

}
