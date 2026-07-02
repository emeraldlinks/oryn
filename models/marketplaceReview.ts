import type { MarketplaceListing } from "./marketplaceListing";
import type { User } from "./user";

export interface MarketplaceReview {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  listingId: number;
 // @index;not null
  userId: number;
 // @not null
  rating: number;
 // @nullable
  content?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:MarketplaceListing;foreignKey:listingId;onDelete:CASCADE
  listing?: MarketplaceListing;
 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
