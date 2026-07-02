import type { Activity } from "./activity";
import type { Contact } from "./contact";
import type { Meeting } from "./meeting";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Deal {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @length:200;not null
  title: string;
  value: number;
 // @default:USD;length:3
  currency: string;
 // @default:lead;enum:(lead,qualified,proposal,negotiation,closed-won,closed-lost)
  stage: string;
 // @default:10
  probability: number;
 // @nullable
  expectedCloseDate?: string;
 // @nullable;index
  assignedTo?: number;
 // @nullable;index
  branchId?: number;
 // @nullable
  wonAt?: string;
 // @nullable
  lostAt?: string;
 // @nullable;length:500
  lostReason?: string;
 // @nullable;json
  notes?: string;
  createdAt: string;
  updatedAt: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;
 // @relation onetomany:Activity;foreignKey:dealId
  activities?: Activity[];
 // @relation onetomany:Meeting;foreignKey:dealId
  meetings?: Meeting[];

}
