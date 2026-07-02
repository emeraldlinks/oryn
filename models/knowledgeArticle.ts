import type { Workspace } from "./workspace";

export interface KnowledgeArticle {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
  bodyHtml: string;
 // @nullable;json
  categories?: string[];
 // @nullable;json
  tags?: string[];
 // @default:published;enum:(published,draft,archived)
  status: string;
 // @default:0
  views: number;
 // @default:0
  helpfulCount: number;
 // @default:0
  notHelpfulCount: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
