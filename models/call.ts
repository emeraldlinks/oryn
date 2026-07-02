import type { Contact } from "./contact";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Call {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  contactId?: number;
 // @index;not null
  userId: number;
 // @enum:(inbound,outbound);not null
  direction: string;
 // @length:30;not null
  phoneNumber: string;
 // @default:0
  duration?: number;
 // @nullable;length:500
  recordingUrl?: string;
 // @nullable
  transcript?: string;
 // @nullable;length:50
  sentiment?: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
