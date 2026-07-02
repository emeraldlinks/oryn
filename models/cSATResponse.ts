import type { Contact } from "./contact";
import type { Ticket } from "./ticket";
import type { Workspace } from "./workspace";

export interface CSATResponse {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @nullable;index
  ticketId?: number;
 // @not null
  score: number;
 // @nullable
  comment?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:Ticket;foreignKey:ticketId
  ticket?: Ticket;

}
