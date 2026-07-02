import type { Workspace } from "./workspace";
import type { InventoryItem } from "./inventoryItem";

export interface InventoryVariant {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  itemId: number;
 // @length:200;not null
  name: string;
 // @nullable;length:100
  sku?: string;
 // @nullable;length:100
  barcode?: string;
 // @nullable
  price?: number;
 // @nullable
  cost?: number;
 // @nullable;length:500
  imageUrl?: string;
 // @nullable;json
  attributes?: Record<string, unknown>;
 // @nullable;default:0
  stock?: number;
 // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:InventoryItem;foreignKey:itemId
  item?: InventoryItem;

}
