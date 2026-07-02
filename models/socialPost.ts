import type { SocialAccount } from "./socialAccount";
import type { SocialReply } from "./socialReply";

export interface SocialPost {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  socialAccountId: number;
  content: string;
 // @nullable;json
  mediaUrls?: string[];
 // @default:draft;enum:(draft,scheduled,published,failed)
  status: string;
 // @nullable
  scheduledAt?: string;
 // @nullable
  publishedAt?: string;
 // @nullable;length:200
  platformPostId?: string;
 // @default:0
  likes?: number;
 // @default:0
  comments?: number;
 // @default:0
  shares?: number;
 // @default:0
  reach?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:SocialAccount;foreignKey:socialAccountId;onDelete:CASCADE
  account?: SocialAccount;
 // @relation onetomany:SocialReply;foreignKey:socialPostId
  replies?: SocialReply[];

}
