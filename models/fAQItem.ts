import type { Workspace } from "./workspace";

export interface FAQItem {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  question: string;
  bodyHtml: string;
 // @nullable;length:100
  category?: string;
 // @default:0
  sortOrder: number;
 // @default:true
  published: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
