import type { Workspace } from "./workspace";

export interface ScheduledReport {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @json;not null
  config: Record<string, unknown>;
 // @length:50;not null
  frequency: string;
 // @json;nullable
  recipients?: string[];
 // @default:true
  active: boolean;
 // @nullable
  lastSentAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
