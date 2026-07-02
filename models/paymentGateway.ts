import type { Workspace } from "./workspace";

export interface PaymentGateway {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  provider: string;
 // @not null
  apiKey: string;
 // @nullable
  apiSecret?: string;
 // @nullable
  webhookSecret?: string;
 // @default:true
  active: boolean;
 // @default:false
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
