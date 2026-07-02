import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface EmailSync {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @enum:(gmail,outlook);not null
  provider: string;
 // @not null
  accessToken: string;
 // @nullable
  refreshToken?: string;
 // @nullable
  expiresAt?: string;
 // @length:255;not null
  email: string;
 // @nullable
  lastSyncedAt?: string;
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
