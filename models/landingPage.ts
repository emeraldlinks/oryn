import type { Workspace } from "./workspace";

export interface LandingPage {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @unique;length:100;not null
  slug: string;
 // @length:200;not null
  title: string;
 // @nullable;json
  contentJson?: Record<string, unknown>;
 // @default:false
  published: boolean;
 // @default:0
  views?: number;
 // @default:0
  conversions?: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
