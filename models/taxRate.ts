import type { Workspace } from "./workspace";

export interface TaxRate {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:10;not null
  rate: number;
 // @length:100;nullable
  region?: string;
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
