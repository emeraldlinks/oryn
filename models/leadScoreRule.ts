import type { Workspace } from "./workspace";

export interface LeadScoreRule {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:50;not null
  entityType: string;
 // @json;not null
  conditions: Record<string, unknown>;
  scoreValue: number;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
