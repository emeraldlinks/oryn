import type { ProjectMilestone } from "./projectMilestone";
import type { ProjectTask } from "./projectTask";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Project {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable
  description?: string;
 // @default:active;enum:(active,on_hold,completed,cancelled)
  status: string;
 // @default:medium;enum:(low,medium,high,urgent)
  priority: string;
 // @nullable;index
  ownerId?: number;
 // @nullable
  startDate?: string;
 // @nullable
  endDate?: string;
 // @nullable;json
  tags?: string[];
 // @nullable
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:ownerId
  owner?: User;
 // @relation onetomany:ProjectTask;foreignKey:projectId
  tasks?: ProjectTask[];
 // @relation onetomany:ProjectMilestone;foreignKey:projectId
  milestones?: ProjectMilestone[];

}
