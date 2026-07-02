import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Whiteboard {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @json;not null
  data: Record<string, unknown>;
 // @nullable;json
  participants?: number[];
 // @nullable;index
  createdBy?: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:User;foreignKey:createdBy
  creator?: User;

}
