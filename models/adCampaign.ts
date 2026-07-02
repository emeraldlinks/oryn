import type { SocialAccount } from "./socialAccount";

export interface AdCampaign {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  socialAccountId: number;
 // @nullable;length:200
  platformCampaignId?: string;
 // @length:200;not null
  name: string;
 // @length:100;not null
  objective: string;
 // @default:active;enum:(active,paused,ended,archived)
  status: string;
  budget: number;
 // @default:0
  spent?: number;
 // @default:0
  impressions?: number;
 // @default:0
  clicks?: number;
 // @default:0
  conversions?: number;
 // @not null
  startDate: string;
 // @nullable
  endDate?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:SocialAccount;foreignKey:socialAccountId;onDelete:CASCADE
  socialAccount?: SocialAccount;

}
