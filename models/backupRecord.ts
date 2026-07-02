import type { Workspace } from "./workspace";

export interface BackupRecord {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:50;not null
  type: string;
 // @length:500;nullable
  fileUrl?: string;
 // @nullable
  fileSize?: number;
 // @length:20;not null;default:draft
  status: string;
 // @nullable
  errorMessage?: string;
 // @nullable
  startedAt?: string;
 // @nullable
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
