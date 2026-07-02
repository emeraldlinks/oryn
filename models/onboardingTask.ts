import type { Contact } from "./contact";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface OnboardingTask {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @length:200;not null
  title: string;
 // @nullable
  description?: string;
 // @default:pending;enum:(pending,in_progress,completed,skipped)
  status: string;
 // @nullable
  dueDate?: string;
 // @nullable
  completedAt?: string;
 // @nullable;index
  assignedTo?: number;
 // @default:0
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;

}
