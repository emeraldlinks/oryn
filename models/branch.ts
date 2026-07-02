import type { Employee } from "./employee";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Branch {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  name: string;
 // @nullable;length:255
  address?: string;
 // @nullable;length:100
  city?: string;
 // @length:100
  country: string;
 // @nullable;length:30
  phone?: string;
 // @nullable;index
  managerId?: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:managerId
  manager?: User;
 // @relation onetomany:Employee;foreignKey:branchId
  employees?: Employee[];

}
