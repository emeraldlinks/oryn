import type { Workspace } from "./workspace";

export interface BookingLink {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @unique;length:100;not null
  slug: string;
 // @length:200;not null
  title: string;
 // @nullable
  description?: string;
 // @not null
  durationMinutes: number;
 // @json;nullable
  availability?: Record<string, unknown>;
 // @json;nullable
  bufferConfig?: Record<string, unknown>;
 // @default:true
  active: boolean;
 // @default:0
  totalBookings: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
