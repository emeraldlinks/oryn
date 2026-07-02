import type { Workspace } from "./workspace";

export interface FeatureFlag {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  key: string;
 // @default:false
  enabled: boolean;
 // @nullable
  description?: string;
 // @json;nullable
  rules?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
