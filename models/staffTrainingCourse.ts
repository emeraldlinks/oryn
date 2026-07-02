import type { Workspace } from "./workspace";

export interface StaffTrainingCourse {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:300;not null
  title: string;
 // @nullable
  description?: string;
 // @nullable;length:200
  provider?: string;
 // @nullable;length:50
  duration?: string;
 // @nullable;default:0
  cost?: number;
 // @default:false
  certificationOffered?: boolean;
 // @default:false
  isMandatory?: boolean;
 // @length:20;default:active
  status?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
