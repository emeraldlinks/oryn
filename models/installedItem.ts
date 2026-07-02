import type { MarketplaceListing } from "./marketplaceListing";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface InstalledItem {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  listingId: number;
 // @json;nullable
  settings?: Record<string, unknown>;
 // @default:true
  active: boolean;
 // @nullable
  installedById?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:MarketplaceListing;foreignKey:listingId;onDelete:CASCADE
  listing?: MarketplaceListing;
 // @relation manytoone:User;foreignKey:installedById
  installedBy?: User;

}
