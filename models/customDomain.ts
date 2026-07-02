import type { Workspace } from "./workspace";

export interface CustomDomain {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:253;not null;unique
  domain: string;
 // @default:false
  verified: boolean;
 // @nullable
  verifiedAt?: string;
 // @default:false
  sslEnabled: boolean;
 // @nullable
  sslExpiresAt?: string;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
