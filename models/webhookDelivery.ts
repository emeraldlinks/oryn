import type { Workspace } from "./workspace";

export interface WebhookDelivery {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  endpointId: number;
 // @length:20;not null
  status: string;
 // @not null
  httpStatus: number;
 // @json;nullable
  requestHeaders?: Record<string, unknown>;
 // @nullable
  requestBody?: string;
 // @json;nullable
  responseHeaders?: Record<string, unknown>;
 // @nullable
  responseBody?: string;
 // @nullable
  errorMessage?: string;
 // @default:0
  durationMs: number;
 // @nullable
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
