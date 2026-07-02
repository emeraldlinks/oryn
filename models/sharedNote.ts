import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface SharedNote {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
  bodyHtml: string;
 // @nullable;json
  sharedWith?: number[];
 // @nullable;index
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:createdBy
  creator?: User;

}
