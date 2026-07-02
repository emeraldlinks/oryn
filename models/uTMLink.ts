import type { Workspace } from "./workspace";

export interface UTMLink {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:255;not null
  sourceUrl: string;
 // @length:255;not null
  targetUrl: string;
 // @nullable;length:200
  campaign?: string;
 // @nullable;length:200
  source?: string;
 // @nullable;length:200
  medium?: string;
 // @nullable;length:200
  content?: string;
 // @nullable;length:200
  term?: string;
 // @default:0
  clicks: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
