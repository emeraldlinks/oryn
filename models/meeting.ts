import type { Contact } from "./contact";
import type { Deal } from "./deal";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Meeting {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
 // @nullable;index
  contactId?: number;
 // @nullable;index
  dealId?: number;
 // @index;not null
  userId: number;
 // @not null
  scheduledAt: string;
 // @nullable;default:30
  duration?: number;
 // @nullable;length:500
  meetingUrl?: string;
 // @nullable
  notes?: string;
 // @default:scheduled;enum:(scheduled,ongoing,completed,cancelled)
  status: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
