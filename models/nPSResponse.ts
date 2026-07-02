import type { Contact } from "./contact";
import type { Workspace } from "./workspace";

export interface NPSResponse {

 // @auto;primaryKey
  id: number; 
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @not null
  score: number;
 // @nullable
  comment?: string;
 // @nullable;index
  surveyId?: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
