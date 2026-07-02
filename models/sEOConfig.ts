import type { LandingPage } from "./landingPage";
import type { Workspace } from "./workspace";

export interface SEOConfig {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @unique;index;not null
  pageId: number;
 // @length:200;nullable
  metaTitle?: string;
 // @length:300;nullable
  metaDescription?: string;
 // @nullable;json
  keywords?: string[];
 // @nullable;length:500
  ogImageUrl?: string;
 // @nullable
  canonicalUrl?: string;
 // @default:false
  noIndex: boolean;
 // @json;nullable
  structuredData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:LandingPage;foreignKey:pageId
  page?: LandingPage;

}
