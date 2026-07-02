import type { Workspace } from "./workspace";

export interface SMSCampaign {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
  body: string;
 // @default:draft;enum:(draft,scheduled,sending,sent,failed)
  status: string;
 // @nullable
  scheduledAt?: string;
 // @nullable
  sentAt?: string;
 // @default:0
  recipientCount: number;
 // @default:0
  deliveredCount: number;
 // @nullable;json
  targetFilters?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
