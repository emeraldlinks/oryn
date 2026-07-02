import type { DepartmentModule } from "./departmentModule";
import type { StaffDepartment } from "./staffDepartment";
import type { Workspace } from "./workspace";

export interface DepartmentModuleAssignment {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @index;not null
  departmentId: number;
  // @index;not null
  moduleId: number;
  // @nullable;json
  config?: Record<string, unknown>;
  // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:StaffDepartment;foreignKey:departmentId;onDelete:CASCADE
  department?: StaffDepartment;
  // @relation manytoone:DepartmentModule;foreignKey:moduleId;onDelete:CASCADE
  module?: DepartmentModule;

}
