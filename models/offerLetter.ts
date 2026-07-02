import type { JobApplication } from "./jobApplication";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface OfferLetter {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  applicationId: number;
 // @nullable;index
  approvedById?: number;
 // @nullable
  offeredSalary: number;
 // @length:3;default:NGN
  currency: string;
 // @nullable
  startDate?: string;
 // @nullable;length:500
  terms?: string;
 // @nullable;json
  benefits?: string[];
 // @default:draft;enum:(draft,sent,accepted,declined,expired)
  status: string;
 // @nullable
  sentAt?: string;
 // @nullable
  respondedAt?: string;
 // @nullable;json
  signedDocumentUrl?: string;
 // @nullable;length:500
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:JobApplication;foreignKey:applicationId
  application?: JobApplication;
 // @relation manytoone:User;foreignKey:approvedById
  approvedBy?: User;

}
