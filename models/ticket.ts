import type { Contact } from "./contact";
import type { TicketMessage } from "./ticketMessage";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Ticket {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @length:200;not null
  subject: string;
 // @default:open;enum:(open,waiting,answered,resolved,closed)
  status: string;
 // @default:medium;enum:(low,medium,high,urgent)
  priority: string;
 // @nullable;index
  assignedTo?: number;
 // @nullable
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;
 // @relation onetomany:TicketMessage;foreignKey:ticketId
  messages?: TicketMessage[];

}
