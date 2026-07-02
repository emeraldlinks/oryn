import type { Workspace } from "./workspace";
import type { InventoryCategory } from "./inventoryCategory";
import type { InventoryBrand } from "./inventoryBrand";

export interface InventoryItem {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:300;not null
  name: string;
 // @nullable;unique;length:100
  sku?: string;
 // @nullable;length:100
  barcode?: string;
 // @nullable
  description?: string;
 // @nullable;index
  categoryId?: number;
 // @nullable;index
  brandId?: number;
 // @nullable;length:50
  unit?: string;
 // @default:0.00
  price: number;
 // @default:0.00
  cost: number;
 // @nullable
  taxRateId?: number;
 // @nullable
  weight?: number;
 // @nullable;length:100
  dimensions?: string;
 // @nullable;length:500
  imageUrl?: string;
 // @default:true
  isActive: boolean;
 // @default:true
  trackStock: boolean;
 // @default:false
  trackSerial: boolean;
 // @default:false
  trackBatch: boolean;
 // @nullable;default:0
  minStock?: number;
 // @nullable;default:0
  maxStock?: number;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryCategory;foreignKey:categoryId
  category?: InventoryCategory;
 // @relation manytoone:InventoryBrand;foreignKey:brandId
  brand?: InventoryBrand;

}
