import type { Activity } from "./activity";
import type { Call } from "./call";
import type { Employee } from "./employee";
import type { Meeting } from "./meeting";
import type { Notification } from "./notification";
import type { Workspace } from "./workspace";

export interface User {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  name: string;
 // @unique;length:255;not null
  email: string;
 // @nullable;length:255
  passwordHash?: string;
 // @default:employee;enum:(superadmin,admin,manager,employee,client)
  role: string;
 // @nullable;length:500
  avatarUrl?: string;
 // @nullable
  lastLoginAt?: string;
 // @nullable;json
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:Activity;foreignKey:userId
  activities?: Activity[];
 // @relation onetomany:Employee;foreignKey:userId
  employeeProfile?: Employee[];
 // @relation onetomany:Call;foreignKey:userId
  calls?: Call[];
 // @relation onetomany:Meeting;foreignKey:userId
  meetings?: Meeting[];
 // @relation onetomany:Notification;foreignKey:userId
  notifications?: Notification[];

}
