import type { SocialPost } from "./socialPost";

export interface SocialReply {

 // @auto;primaryKey
  id: number;
 // @index;not null
  socialPostId: number;
 // @length:200;not null
  platformCommentId: string;
 // @length:100;not null
  authorName: string;
  content: string;
 // @nullable
  repliedContent?: string;
 // @nullable
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:SocialPost;foreignKey:socialPostId;onDelete:CASCADE
  post?: SocialPost;

}
