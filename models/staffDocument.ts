import type { Employee } from "./employee";
import type { Workspace } from "./workspace";

export interface StaffDocument {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  employeeId: number;
 // @length:50;not null
  type: string;
 // @length:300;not null
  name: string;
 // @nullable;length:500
  fileUrl?: string;
 // @length:20;default:active
  status?: string;
 // @nullable;length:10
  expiryDate?: string;
 // @nullable;length:30
  signedAt?: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;

}
