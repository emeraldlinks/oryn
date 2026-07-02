import type { Workflow } from "./workflow";

export interface WorkflowVersion {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workflowId: number;
 // @not null
  version: number;
 // @json;not null
  definition: Record<string, unknown>;
 // @nullable
  notes?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workflow;foreignKey:workflowId;onDelete:CASCADE
  workflow?: Workflow;

}
