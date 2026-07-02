import type { Project } from "./project";
import type { ProjectTask } from "./projectTask";

export interface ProjectMilestone {

 // @auto;primaryKey
  id: number;
 // @index;not null
  projectId: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable
  description?: string;
 // @not null
  dueDate: string;
 // @default:pending;enum:(pending,in_progress,completed)
  status: string;
 // @nullable
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Project;foreignKey:projectId;onDelete:CASCADE
  project?: Project;
 // @relation onetomany:ProjectTask;foreignKey:milestoneId
  tasks?: ProjectTask[];

}
