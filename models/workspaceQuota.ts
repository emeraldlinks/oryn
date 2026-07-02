import type { Workspace } from "./workspace";

export interface WorkspaceQuota {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @not null
  maxUsers: number;
 // @not null
  maxStorageGb: number;
 // @not null
  maxContacts: number;
 // @not null
  maxDeals: number;
 // @not null
  maxProjects: number;
 // @default:false
  canUseAI: boolean;
 // @default:false
  canUseAPI: boolean;
 // @default:false
  canUseAutomation: boolean;
 // @json;nullable
  limits?: Record<string, number>;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
