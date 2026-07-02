import type { WordpressPost } from "./wordpressPost";
import type { Workspace } from "./workspace";

export interface WordpressSite {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:255;not null
  siteUrl: string;
 // @length:100;not null
  appUsername: string;
  appPassword: string;
 // @nullable;length:200
  siteName?: string;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:WordpressPost;foreignKey:wordpressSiteId
  posts?: WordpressPost[];

}
