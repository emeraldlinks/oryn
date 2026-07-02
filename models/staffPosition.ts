import type { Employee } from "./employee";
import type { StaffDepartment } from "./staffDepartment";
import type { Workspace } from "./workspace";

export interface StaffPosition {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @length:200;not null
  title: string;
  // @nullable;index
  departmentId?: number;
  // @nullable
  description?: string;
  // @nullable
  salaryMin?: number;
  // @nullable
  salaryMax?: number;
  // @nullable
  requirements?: string;
  // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:StaffDepartment;foreignKey:departmentId
  department?: StaffDepartment;
  // @relation onetomany:Employee;foreignKey:positionId
  employees?: Employee[];

}
