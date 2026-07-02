import type { Contact } from "./contact";
import type { Deal } from "./deal";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Activity {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @enum:(call,email,meeting,task,note,deal-status-change,social);not null
  type: string;
 // @length:200;not null
  subject: string;
 // @nullable
  body?: string;
 // @nullable;index
  contactId?: number;
 // @nullable;index
  dealId?: number;
 // @index;not null
  userId: number;
 // @nullable
  dueAt?: string;
 // @nullable
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
