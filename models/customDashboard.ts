import type { Workspace } from "./workspace";

export interface CustomDashboard {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @nullable
  description?: string;
 // @json;not null
  widgets: Record<string, unknown>;
 // @default:0
  sortOrder: number;
 // @default:true
  shared: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
