import type { Workspace } from "./workspace";

export interface AuditSetting {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @default:true
  enabled: boolean;
 // @default:30
  retentionDays: number;
 // @json;not null;default:[]
  trackedEvents: string[];
 // @json;nullable
  excludedUsers?: number[];

  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
