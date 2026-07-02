import type { EmailCampaign } from "./emailCampaign";
import type { Workspace } from "./workspace";

export interface EmailTemplate {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:255;not null
  subject: string;
  bodyHtml: string;
 // @nullable;json
  variables?: string[];
 // @default:active;enum:(active,archived)
  status: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:EmailCampaign;foreignKey:templateId
  campaigns?: EmailCampaign[];

}
