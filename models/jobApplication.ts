import type { Candidate } from "./candidate";
import type { Interview } from "./interview";
import type { JobPosting } from "./jobPosting";
import type { OfferLetter } from "./offerLetter";
import type { Workspace } from "./workspace";

export interface JobApplication {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  jobId: number;
 // @index;not null
  candidateId: number;
 // @nullable;length:500
  coverLetter?: string;
 // @nullable;json
  cvUrl?: string;
 // @nullable;json
  additionalDocs?: string[];
 // @nullable;json
  answers?: any;
 // @default:applied;enum:(applied,screened,shortlisted,interviewed,offered,hired,rejected,withdrawn)
  stage: string;
 // @nullable
  stageChangedAt?: string;
 // @default:false
  isViewed: boolean;
 // @nullable
  viewedAt?: string;
 // @nullable
  appliedAt: string;
 // @nullable;json
  scoreBreakdown?: Record<string, number>;
 // @nullable
  totalScore?: number;
 // @nullable;json
  notes?: string;
 // @nullable;index
  reviewerId?: number;
  createdAt?: string;
  updatedAt?: string;
 // @softDelete
  deletedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:JobPosting;foreignKey:jobId
  job?: JobPosting;
 // @relation manytoone:Candidate;foreignKey:candidateId
  candidate?: Candidate;
 // @relation onetomany:Interview;foreignKey:applicationId
  interviews?: Interview[];
 // @relation onetoone:OfferLetter;foreignKey:applicationId
  offer?: OfferLetter;

}
