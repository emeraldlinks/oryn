import type { Employee } from "./employee";
import type { StaffDepartment } from "./staffDepartment";
import type { Workspace } from "./workspace";

export interface StaffDepartment {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @length:200;not null
  name: string;
  // @nullable
  description?: string;
  // @nullable;index
  parentId?: number;
  // @nullable
  headEmployeeId?: number;
  // @nullable;length:7
  color?: string;
  // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:StaffDepartment;foreignKey:parentId
  parent?: StaffDepartment;
  // @relation onetomany:StaffDepartment;foreignKey:parentId
  children?: StaffDepartment[];
  // @relation onetomany:Employee;foreignKey:departmentId
  employees?: Employee[];

}
