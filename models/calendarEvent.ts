import type { Contact } from "./contact";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface CalendarEvent {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
 // @nullable
  description?: string;
 // @not null
  startTime: string;
 // @not null
  endTime: string;
 // @default:false
  allDay: boolean;
 // @nullable;length:100
  color?: string;
 // @json;nullable
  attendees?: string[];
 // @nullable;index
  userId?: number;
 // @nullable;index
  contactId?: number;
 // @nullable;length:500
  location?: string;
 // @nullable
  externalEventId?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
