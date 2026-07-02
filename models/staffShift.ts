import type { Workspace } from "./workspace";

export interface StaffShift {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @length:200;not null
  name: string;
  // @length:5;not null
  startTime: string;
  // @length:5;not null
  endTime: string;
  // @nullable;default:0
  breakDuration?: number;
  // @nullable;json
  workingDays?: Record<string, unknown>;
  // @default:true
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
