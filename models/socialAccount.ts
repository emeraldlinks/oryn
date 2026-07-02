import type { AdCampaign } from "./adCampaign";
import type { SocialPost } from "./socialPost";
import type { Workspace } from "./workspace";

export interface SocialAccount {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @enum:(facebook,instagram,twitter,linkedin,tiktok,youtube);not null
  platform: string;
 // @length:200;not null
  accountName: string;
 // @not null
  accessToken: string;
 // @nullable
  refreshToken?: string;
 // @nullable
  expiresAt?: string;
 // @nullable;length:500
  profileImageUrl?: string;
 // @nullable
  connectedAt: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:SocialPost;foreignKey:socialAccountId
  posts?: SocialPost[];
 // @relation onetomany:AdCampaign;foreignKey:socialAccountId
  adCampaigns?: AdCampaign[];

}
