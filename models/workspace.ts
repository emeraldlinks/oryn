import type { Branch } from "./branch";
import type { Contact } from "./contact";
import type { Deal } from "./deal";
import type { Employee } from "./employee";
import type { Product } from "./product";
import type { Ticket } from "./ticket";
import type { User } from "./user";

export interface Workspace {

 // @auto;primaryKey
  id?: number;
 // @unique;length:100;not null
  name: string;
 // @unique;length:50;not null
  slug: string;
 // @default:starter;enum:(starter,growth,scale,enterprise)
  plan: string;
 // @default:true
  active: boolean;
 // @json
  settings?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation onetomany:User;foreignKey:workspaceId
  users?: User[];
 // @relation onetomany:Branch;foreignKey:workspaceId
  branches?: Branch[];
 // @relation onetomany:Contact;foreignKey:workspaceId
  contacts?: Contact[];
 // @relation onetomany:Deal;foreignKey:workspaceId
  deals?: Deal[];
 // @relation onetomany:Product;foreignKey:workspaceId
  products?: Product[];
 // @relation onetomany:Employee;foreignKey:workspaceId
  employees?: Employee[];
 // @relation onetomany:Ticket;foreignKey:workspaceId
  tickets?: Ticket[];

}
