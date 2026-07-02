import type { FormSubmission } from "./formSubmission";
import type { Workspace } from "./workspace";

export interface Form {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @length:200;not null
  name: string;
 // @json;not null
  fieldsJson: Record<string, unknown>;
 // @default:0
  submissions?: number;
 // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation onetomany:FormSubmission;foreignKey:formId
  submissionsList?: FormSubmission[];

}
