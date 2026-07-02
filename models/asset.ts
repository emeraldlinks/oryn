import type { Contact } from "./contact";
import type { Workspace } from "./workspace";

export interface Asset {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  contactId?: number;
 // @length:200;not null
  name: string;
 // @length:100;not null
  type: string;
 // @nullable
  purchaseDate?: string;
 // @nullable
  warrantyEnd?: string;
 // @nullable
  value?: number;
 // @nullable;json
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
