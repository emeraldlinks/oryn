import type { Employee } from "./employee";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface StaffDisciplinaryAction {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  employeeId: number;
 // @length:50;not null
  type: string;
 // @nullable
  description?: string;
 // @length:30;not null
  date: string;
 // @nullable;index
  issuedById?: number;
 // @length:20;default:moderate
  severity?: string;
 // @length:20;default:open
  status?: string;
 // @nullable
  resolutionNotes?: string;
 // @nullable;length:30
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
 // @relation manytoone:User;foreignKey:issuedById
  issuedBy?: User;

}
