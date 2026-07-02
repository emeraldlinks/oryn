import type { Workspace } from "./workspace";

export interface Workflow {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @length:100;not null
  triggerType: string;
 // @json;not null
  triggerConfig: Record<string, unknown>;
 // @json;not null
  actions: Record<string, unknown>;
 // @default:true
  active: boolean;
 // @default:0
  runCount: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
