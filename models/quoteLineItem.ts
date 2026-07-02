import type { Product } from "./product";
import type { Quote } from "./quote";

export interface QuoteLineItem {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  quoteId: number;
 // @index;not null
  productId: number;
  quantity: number;
  unitPrice: number;
 // @default:0
  discountPercent: number;
 // @default:0
  discountAmount: number;
  total: number;
 // @nullable
  description?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Quote;foreignKey:quoteId;onDelete:CASCADE
  quote?: Quote;
 // @relation manytoone:Product;foreignKey:productId
  product?: Product;

}
