import type { Candidate } from "./candidate";
import type { JobApplication } from "./jobApplication";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface Interview {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  applicationId: number;
 // @index;not null
  candidateId: number;
 // @index;nullable
  interviewerId?: number;
 // @length:100;enum:(phone,video,in-person,technical,cultural,final)
  type: string;
 // @not null
  scheduledAt: string;
 // @nullable
  durationMinutes?: number;
 // @nullable;length:500
  location?: string;
 // @nullable;length:500
  meetingLink?: string;
 // @default:scheduled;enum:(scheduled,completed,cancelled,rescheduled,no_show)
  status: string;
 // @nullable;json
  feedback?: any;
 // @nullable
  rating?: number;
 // @nullable;json
  questions?: string[];
 // @nullable;json
  reviewerNotes?: string;
 // @nullable;index
  completedById?: number;
 // @nullable
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:JobApplication;foreignKey:applicationId
  application?: JobApplication;
 // @relation manytoone:Candidate;foreignKey:candidateId
  candidate?: Candidate;
 // @relation manytoone:User;foreignKey:interviewerId
  interviewer?: User;

}
