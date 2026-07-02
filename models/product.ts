import type { OrderItem } from "./orderItem";
import type { Workspace } from "./workspace";

export interface Product {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable;unique;length:50
  sku?: string;
 // @nullable
  description?: string;
 // @default:0.00
  price: number;
 // @default:USD;length:3
  currency: string;
 // @nullable;default:0
  stock?: number;
 // @nullable;length:100
  category?: string;
 // @nullable;length:500
  imageUrl?: string;
 // @default:false
  isService: boolean;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:OrderItem;foreignKey:productId
  orderItems?: OrderItem[];

}
