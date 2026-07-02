
export interface ChatMessage {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;length:100
  visitorId?: string;
 // @nullable;length:200
  visitorName?: string;
 // @nullable;length:255
  visitorEmail?: string;
 // @nullable;index
  contactId?: number;
 // @nullable;index
  userId?: number;
 // @not null
  body: string;
 // @default:visitor;enum:(visitor,agent,system)
  sender: string;
 // @nullable
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;

}
