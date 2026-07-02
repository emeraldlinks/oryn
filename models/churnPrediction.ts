import type { Contact } from "./contact";
import type { Workspace } from "./workspace";

export interface ChurnPrediction {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @default:0
  riskScore: number;
 // @length:50;not null
  riskLevel: string;
 // @json;nullable
  factors?: Record<string, unknown>;
 // @nullable
  predictedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
