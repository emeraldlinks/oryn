import type { Workspace } from "./workspace";

export interface MarketingSegment {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @json;not null
  filters: Record<string, unknown>;
 // @default:0
  contactCount: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
