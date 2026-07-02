import type { Ticket } from "./ticket";
import type { User } from "./user";

export interface TicketMessage {

 // @auto;primaryKey
  id: number;
 // @index;not null
  ticketId: number;
 // @nullable;index
  userId?: number;
  body: string;
 // @default:false
  isFromClient: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Ticket;foreignKey:ticketId;onDelete:CASCADE
  ticket?: Ticket;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
