import type { Workspace } from "./workspace";

export interface EscalationRule {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @enum:(priority,time,keyword,assignment)
  triggerType: string;
 // @json;not null
  conditions: Record<string, unknown>;
 // @json;not null
  actions: Record<string, unknown>;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
