import type { DepartmentModuleAssignment } from "./departmentModuleAssignment";
import type { Workspace } from "./workspace";

export interface DepartmentModule {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @length:100;not null
  key: string;
  // @length:200;not null
  name: string;
  // @nullable;length:500
  description?: string;
  // @nullable;length:100
  icon?: string;
  // @length:100;not null
  category: string;
  // @nullable;length:200
  href?: string;
  // @default:true
  isActive: boolean;
  // @default:0
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:DepartmentModuleAssignment;foreignKey:moduleId
  assignments?: DepartmentModuleAssignment[];

}
