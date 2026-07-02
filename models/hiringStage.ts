import type { JobPosting } from "./jobPosting";
import type { Workspace } from "./workspace";

export interface HiringStage {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  name: string;
 // @nullable;length:200
  description?: string;
 // @default:0
  sortOrder: number;
 // @length:50;default:active;enum:(active,inactive)
  status: string;
 // @nullable;length:20;enum:(applied,screening,shortlist,interview,offer,hired,rejected)
  type: string;
 // @default:false
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:JobPosting;foreignKey:hiringStageId
  jobPostings?: JobPosting[];

}
