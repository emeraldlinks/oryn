import type { Workspace } from "./workspace";

export interface InventorySupplier {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable;length:50;unique
  code?: string;
 // @nullable;length:200
  contactPerson?: string;
 // @nullable;length:200
  email?: string;
 // @nullable;length:30
  phone?: string;
 // @nullable
  address?: string;
 // @nullable;length:100
  city?: string;
 // @nullable;length:100
  state?: string;
 // @nullable;length:100
  country?: string;
 // @nullable;length:100
  paymentTerms?: string;
 // @nullable;length:50
  taxId?: string;
 // @default:true
  isActive: boolean;
 // @nullable;default:0
  rating?: number;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
