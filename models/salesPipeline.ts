import type { Workspace } from "./workspace";

export interface SalesPipeline {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @json;not null
  stages: Record<string, unknown>;
 // @default:false
  isDefault: boolean;
 // @default:true
  active: boolean;
 // @default:0
  sortOrder: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
