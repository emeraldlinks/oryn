import type { Workspace } from "./workspace";

export interface CohortData {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @not null
  cohortDate: string;
 // @length:50;not null
  period: string;
 // @default:0
  userCount: number;
 // @json;not null
  retentionData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
