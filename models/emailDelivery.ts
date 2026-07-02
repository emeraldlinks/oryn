import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface EmailDelivery {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:254;not null
  recipient: string;
 // @length:500;not null
  subject: string;
 // @length:20;not null
  status: string;
 // @nullable
  errorMessage?: string;
 // @nullable
  openedAt?: string;
 // @nullable
  clickedAt?: string;
 // @default:0
  openCount: number;
 // @default:0
  clickCount: number;
 // @json;nullable
  metadata?: Record<string, unknown>;
 // @index
  sentById?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:sentById
  sentBy?: User;

}
