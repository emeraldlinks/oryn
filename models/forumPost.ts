import type { ForumTopic } from "./forumTopic";
import type { User } from "./user";

export interface ForumPost {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  topicId: number;
 // @nullable;index
  authorId?: number;
  bodyHtml: string;
 // @default:false
  isSolution: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:ForumTopic;foreignKey:topicId;onDelete:CASCADE
  topic?: ForumTopic;
 // @relation manytoone:User;foreignKey:authorId
  author?: User;

}
