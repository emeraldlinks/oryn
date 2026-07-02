import type { Workspace } from "./workspace";

export interface SystemHealthMetric {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  metric: string;
 // @not null
  value: number;
 // @length:50;nullable
  unit?: string;
 // @json;nullable
  tags?: Record<string, unknown>;
 // @not null
  recordedAt: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
