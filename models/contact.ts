import type { Activity } from "./activity";
import type { Call } from "./call";
import type { Deal } from "./deal";
import type { Invoice } from "./invoice";
import type { Meeting } from "./meeting";
import type { Message } from "./message";
import type { Ticket } from "./ticket";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Contact {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  firstName: string;
 // @length:100;not null
  lastName: string;
 // @nullable;unique;length:255
  email?: string;
 // @nullable;length:30
  phone?: string;
 // @nullable;length:200
  company?: string;
 // @nullable;length:200
  title?: string;
 // @nullable;default:direct;length:50
  source?: string;
 // @default:lead;enum:(lead,active,qualified,inactive,unsubscribed)
  status: string;
 // @nullable
  assignedTo?: number;
 // @nullable;json
  tags?: string[];
 // @nullable;json
  customFields?: Record<string, unknown>;
 // @nullable
  lastContactedAt?: string;
 // @nullable;default:0
  dealScore?: number;
  createdAt: string;
  updatedAt: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;
 // @relation onetomany:Deal;foreignKey:contactId
  deals?: Deal[];
 // @relation onetomany:Activity;foreignKey:contactId
  activities?: Activity[];
 // @relation onetomany:Message;foreignKey:contactId
  messages?: Message[];
 // @relation onetomany:Call;foreignKey:contactId
  calls?: Call[];
 // @relation onetomany:Meeting;foreignKey:contactId
  meetings?: Meeting[];
 // @relation onetomany:Ticket;foreignKey:contactId
  tickets?: Ticket[];
 // @relation onetomany:Invoice;foreignKey:contactId
  invoices?: Invoice[];

}
