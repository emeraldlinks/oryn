import type { Order } from "./order";
import type { Product } from "./product";

export interface OrderItem {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  orderId: number;
 // @index;not null
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Order;foreignKey:orderId;onDelete:CASCADE
  order?: Order;
 // @relation manytoone:Product;foreignKey:productId
  product?: Product;

}
