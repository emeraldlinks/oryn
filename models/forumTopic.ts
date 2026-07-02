import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface ForumTopic {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  title: string;
 // @nullable;index
  authorId?: number;
 // @nullable
  lastActivityAt?: string;
 // @default:0
  views: number;
 // @default:open;enum:(open,resolved,closed,locked)
  status: string;
 // @default:false
  pinned: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:authorId
  author?: User;

}
