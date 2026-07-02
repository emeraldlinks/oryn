import type { Contact } from "./contact";
import type { Workspace } from "./workspace";

export interface CLVCalculation {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @nullable;index
  contactId?: number;
 // @default:0
  averageOrderValue: number;
 // @default:0
  purchaseFrequency: number;
 // @default:0
  customerLifespan: number;
 // @default:0
  clv: number;
 // @nullable
  calculatedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
