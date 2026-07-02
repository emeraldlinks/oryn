import type { Employee } from "./employee";
import type { StaffSkill } from "./staffSkill";
import type { Workspace } from "./workspace";

export interface StaffEmployeeSkill {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  employeeId: number;
 // @index;not null
  skillId: number;
 // @default:1
  proficiencyLevel?: number;
 // @nullable;default:0
  yearsOfExperience?: number;
 // @default:false
  isPrimary?: boolean;
 // @nullable;length:30
  lastUsedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
 // @relation manytoone:StaffSkill;foreignKey:skillId
  skill?: StaffSkill;

}
