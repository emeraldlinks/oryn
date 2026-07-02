import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface BackgroundJob {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  type: string;
 // @json;nullable
  payload?: Record<string, unknown>;
 // @json;nullable
  result?: Record<string, unknown>;
 // @length:20;not null;default:pending
  status: string;
 // @nullable
  errorMessage?: string;
 // @default:0
  attempts: number;
 // @default:3
  maxAttempts: number;
 // @nullable
  scheduledAt?: string;
 // @nullable
  startedAt?: string;
 // @nullable
  completedAt?: string;
 // @nullable
  nextRetryAt?: string;
 // @index
  userId?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
