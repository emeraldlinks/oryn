import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface PushNotification {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  userId: number;
 // @length:200;not null
  title: string;
  body: string;
 // @nullable;json
  data?: Record<string, unknown>;
 // @default:pending;enum:(pending,sent,delivered,read,failed)
  status: string;
 // @nullable
  sentAt?: string;
 // @nullable
  readAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
