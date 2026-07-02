import type { Contact } from "./contact";
import type { Deal } from "./deal";
import type { Workspace } from "./workspace";

export interface Document {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
 // @length:50;not null
  type: string;
 // @nullable;json
  contentJson?: Record<string, unknown>;
 // @nullable;length:500
  pdfUrl?: string;
 // @nullable;index
  contactId?: number;
 // @nullable;index
  dealId?: number;
 // @default:draft;enum:(draft,final,sent,signed,expired)
  status: string;
 // @nullable
  signedAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;

}
