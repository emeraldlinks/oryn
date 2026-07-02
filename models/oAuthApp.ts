import type { Workspace } from "./workspace";

export interface OAuthApp {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:500;not null
  redirectUris: string;
 // @unique;length:64;not null
  clientId: string;
 // @not null
  clientSecret: string;
 // @json;nullable
  scopes?: string[];
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
