import type { Employee } from "./employee";
import type { Workspace } from "./workspace";

export interface StaffGoal {

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
  // @length:30;default:'quarterly'
  type: string;
  // @nullable;json
  keyResults?: Record<string, unknown>;
  // @default:0
  progress: number;
  // @nullable;length:10
  startDate?: string;
  // @nullable;length:10
  targetDate?: string;
  // @length:20;default:'active'
  status: string;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;

}
