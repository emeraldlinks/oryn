import type { Project } from "./project";
import type { ProjectMilestone } from "./projectMilestone";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface ProjectTask {

 // @auto;primaryKey
  id: number;
 // @index;not null
  projectId: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
 // @nullable
  description?: string;
 // @default:todo;enum:(todo,in_progress,review,done)
  status: string;
 // @default:medium;enum:(low,medium,high,urgent)
  priority: string;
 // @nullable;index
  assigneeId?: number;
 // @nullable;index
  milestoneId?: number;
 // @nullable
  dueDate?: string;
 // @nullable
  estimatedHours?: number;
 // @nullable
  actualHours?: number;
 // @nullable;index
  parentTaskId?: number;
 // @default:0
  sortOrder: number;
 // @nullable
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Project;foreignKey:projectId;onDelete:CASCADE
  project?: Project;
 // @relation manytoone:User;foreignKey:assigneeId
  assignee?: User;
 // @relation manytoone:ProjectMilestone;foreignKey:milestoneId
  milestone?: ProjectMilestone;
 // @relation manytoone:ProjectTask;foreignKey:parentTaskId
  parentTask?: ProjectTask;
 // @relation onetomany:ProjectTask;foreignKey:parentTaskId
  subtasks?: ProjectTask[];

}
