import type { Workspace } from "./workspace";

export interface WorkflowTemplate {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable
  description?: string;
 // @json;not null
  definition: Record<string, unknown>;
 // @length:100;nullable
  category?: string;
 // @default:0
  usageCount: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
