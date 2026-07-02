import type { Workspace } from "./workspace";

export interface CannedResponse {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
  bodyHtml: string;
 // @nullable;json
  shortcuts?: string[];
 // @nullable;length:100
  category?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
