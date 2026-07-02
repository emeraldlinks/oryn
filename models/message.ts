import type { Contact } from "./contact";
import type { Workspace } from "./workspace";

export interface Message {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:50;not null
  channel: string;
 // @enum:(inbound,outbound);not null
  direction: string;
 // @nullable;index
  contactId?: number;
 // @length:255;not null
  fromAddress: string;
 // @length:255;not null
  toAddress: string;
 // @nullable;length:255
  subject?: string;
  body: string;
 // @default:sent;enum:(sent,delivered,read,failed)
  status: string;
 // @nullable
  sentAt?: string;
 // @nullable
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
