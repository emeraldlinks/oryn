import type { Workspace } from "./workspace";

export interface Plugin {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null;unique
  name: string;
 // @length:100;not null
  version: string;
 // @length:200;nullable
  author?: string;
 // @nullable
  description?: string;
 // @length:500;nullable
  entryPoint?: string;
 // @default:false
  enabled: boolean;
 // @json;nullable
  permissions?: string[];
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
