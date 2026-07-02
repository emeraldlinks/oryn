import type { Workspace } from "./workspace";

export interface ABTest {

 // @auto;primaryKey
  id?: number;
  tt?: number
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:200;nullable
  description?: string;
 // @default:draft;enum:(draft,running,paused,completed)
  status: string;
 // @json;not null
  variants: Record<string, unknown>;
 // @json;nullable
  metrics?: Record<string, unknown>;
 // @nullable
  startedAt?: string;
 // @nullable
  completedAt?: string;
 // @nullable;json
  winner?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
