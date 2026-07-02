import type { Employee } from "./employee";
import type { Workspace } from "./workspace";

export interface StaffCertification {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  employeeId: number;
 // @length:300;not null
  name: string;
 // @nullable;length:200
  issuingBody?: string;
 // @nullable;length:100
  certificateNumber?: string;
 // @nullable;length:10
  issueDate?: string;
 // @nullable;length:10
  expiryDate?: string;
 // @default:false
  isVerified?: boolean;
 // @nullable;length:500
  attachmentUrl?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;

}
