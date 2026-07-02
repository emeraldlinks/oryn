import type { Workspace } from "./workspace";

export interface SLAPolicy {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @default:0
  responseTimeMinutes: number;
 // @default:0
  resolutionTimeMinutes: number;
 // @json;nullable
  conditions?: Record<string, unknown>;
 // @json;nullable
  escalationRules?: Record<string, unknown>;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
