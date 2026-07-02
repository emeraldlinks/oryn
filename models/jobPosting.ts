import type { JobApplication } from "./jobApplication";
import type { HiringStage } from "./hiringStage";
import type { Workspace } from "./workspace";

export interface JobPosting {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
  // @length:200;not null
  title: string;
 // @length:200;nullable
  department?: string;
 // @nullable;length:2000
  description?: string;
 // @nullable;json
  requirements?: string[];
 // @nullable;json
  responsibilities?: string[];
 // @nullable;length:100
  location?: string;
 // @nullable;length:50
  employmentType?: string;
 // @nullable
  minSalary?: number;
 // @nullable
  maxSalary?: number;
 // @length:3;default:NGN
  currency: string;
 // @default:draft;enum:(draft,active,paused,closed)
  status: string;
 // @nullable
  publishedAt?: string;
 // @nullable
  closedAt?: string;
 // @default:0
  views: number;
 // @default:0
  applicationsCount: number;
 // @nullable;index
  hiringStageId?: number;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:HiringStage;foreignKey:hiringStageId
  hiringStage?: HiringStage;
 // @relation onetomany:JobApplication;foreignKey:jobId
  applications?: JobApplication[];

}
