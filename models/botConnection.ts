import type { AIAction } from "./aIAction";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface BotConnection {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @unique;length:200;not null
  name: string;
 // @length:100;not null
  provider: string;
 // @unique;length:64;not null
  apiKey: string;
 // @not null
  apiSecret: string;
 // @default:active;enum:(active,suspended,revoked)
  status: string;
 // @default:true
  active: boolean;
 // @nullable
  lastUsedAt?: string;
 // @nullable
  expiresAt?: string;
 // @nullable;json
  allowedActions?: string[];
 // @default:0
  totalRequests: number;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  owner?: User;
 // @relation onetomany:AIAction;foreignKey:botConnectionId
  actions?: AIAction[];

}
