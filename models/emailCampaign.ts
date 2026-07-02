import type { EmailTemplate } from "./emailTemplate";
import type { Workspace } from "./workspace";

export interface EmailCampaign {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  templateId?: number;
 // @length:200;not null
  name: string;
 // @length:255;not null
  subject: string;
  bodyHtml: string;
 // @default:draft;enum:(draft,scheduled,sending,sent,failed)
  status: string;
 // @nullable
  sentAt?: string;
 // @nullable
  scheduledAt?: string;
 // @default:0
  recipientCount?: number;
 // @default:0
  openCount?: number;
 // @default:0
  clickCount?: number;
 // @nullable;json
  targetFilters?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:EmailTemplate;foreignKey:templateId
  template?: EmailTemplate;

}
