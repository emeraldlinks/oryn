import type { WordpressSite } from "./wordpressSite";

export interface WordpressPost {

 // @auto;primaryKey
  id: number;
 // @index;not null
  wordpressSiteId: number;
 // @nullable
  platformPostId?: number;
 // @length:200;not null
  title: string;
  contentHtml: string;
 // @default:draft;enum:(draft,scheduled,published,failed)
  status: string;
 // @nullable
  scheduledAt?: string;
 // @nullable
  publishedAt?: string;
 // @nullable;json
  categories?: string[];
 // @nullable;json
  tags?: string[];
 // @nullable;length:500
  featuredImageUrl?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:WordpressSite;foreignKey:wordpressSiteId;onDelete:CASCADE
  site?: WordpressSite;

}
