import type { Workspace } from "./workspace";
import type { User } from "./user";

export interface Task {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @length:200;not null
  title: string;
  // @nullable
  description?: string;
  // @default:pending;enum:(pending,in_progress,completed)
  status: string;
  // @default:medium;enum:(low,medium,high)
  priority: string;
  // @nullable
  due?: string;
  // @nullable;index
  assignedTo?: number;
  createdAt?: string;
  updatedAt?: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;

}
