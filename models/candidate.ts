import type { JobApplication } from "./jobApplication";
import type { Interview } from "./interview";
import type { Workspace } from "./workspace";

export interface Candidate {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  firstName: string;
 // @length:100;not null
  lastName: string;
 // @length:200;not null
  email: string;
 // @nullable;length:30
  phone?: string;
 // @nullable;length:500
  summary?: string;
 // @nullable;json
  skills?: string[];
 // @nullable;json
  experience?: any;
 // @nullable;json
  education?: any;
 // @nullable;json
  certifications?: string[];
 // @nullable
  totalExperienceYears?: number;
 // @nullable;length:200
  currentCompany?: string;
 // @nullable;length:100
  currentPosition?: string;
 // @nullable;length:200
  linkedInUrl?: string;
 // @nullable;length:500
  portfolioUrl?: string;
 // @nullable;json
  aiScore?: Record<string, number>;
 // @nullable
  overallScore?: number;
 // @nullable;json
  aiInsights?: string[];
 // @nullable;length:50;default:active;enum:(active,passive,archived,blacklisted)
  status: string;
 // @nullable;json
  parsedCv?: any;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:JobApplication;foreignKey:candidateId
  applications?: JobApplication[];
 // @relation onetomany:Interview;foreignKey:candidateId
  interviews?: Interview[];

}
