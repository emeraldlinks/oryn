import type { Workspace } from "./workspace";

export interface MarketingJourney {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable
  description?: string;
 // @default:draft;enum:(draft,active,paused,completed)
  status: string;
 // @json;not null
  triggers: Record<string, unknown>;
 // @json;not null
  steps: Record<string, unknown>;
 // @nullable
  startedAt?: string;
 // @nullable
  completedAt?: string;
 // @default:0
  totalEntered: number;
 // @default:0
  totalConverted: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
