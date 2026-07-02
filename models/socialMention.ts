import type { Workspace } from "./workspace";

export interface SocialMention {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  platform: string;
 // @length:255;not null
  authorName: string;
 // @nullable;length:500
  authorAvatar?: string;
  content: string;
 // @nullable
  postedAt?: string;
 // @nullable
  sentiment?: string;
 // @nullable;length:500
  postUrl?: string;
 // @default:unread;enum:(unread,read,replied,ignored)
  status: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
