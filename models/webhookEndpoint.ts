import type { Workspace } from "./workspace";

export interface WebhookEndpoint {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:500;not null
  url: string;
 // @json;not null
  events: string[];
 // @nullable;json
  headers?: Record<string, unknown>;
 // @default:true
  active: boolean;
 // @default:0
  successCount: number;
 // @default:0
  failureCount: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
