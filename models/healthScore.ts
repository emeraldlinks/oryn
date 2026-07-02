import type { Contact } from "./contact";
import type { Workspace } from "./workspace";

export interface HealthScore {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @default:0
  score: number;
 // @length:50;nullable
  category?: string;
 // @nullable
  notes?: string;
 // @json;nullable
  factors?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
