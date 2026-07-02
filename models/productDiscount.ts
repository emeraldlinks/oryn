import type { Product } from "./product";
import type { Workspace } from "./workspace";

export interface ProductDiscount {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  productId?: number;
 // @length:200;not null
  name: string;
 // @length:20;not null
  discountType: string;
  discountValue: number;
 // @nullable
  minQuantity?: number;
 // @nullable
  maxQuantity?: number;
 // @nullable
  startDate?: string;
 // @nullable
  endDate?: string;
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Product;foreignKey:productId
  product?: Product;

}
