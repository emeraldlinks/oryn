import type { CustomFieldDef } from "./customFieldDef";
import type { Workspace } from "./workspace";

export interface CustomFieldValue {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:50;not null
  entityType: string;
 // @index;not null
  entityId: number;
 // @index;not null
  fieldDefId: number;
 // @nullable
  value?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:CustomFieldDef;foreignKey:fieldDefId;onDelete:CASCADE
  fieldDef?: CustomFieldDef;

}
