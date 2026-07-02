import type { Workspace } from "./workspace";

export interface StaffLeaveType {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @length:200;not null
  name: string;
  // @nullable
  description?: string;
  // @default:0
  daysAllowed: number;
  // @default:true
  isPaid: boolean;
  // @default:true
  requiresApproval: boolean;
  // @default:false
  carryForward: boolean;
  // @nullable;length:20
  genderRestriction?: string;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
