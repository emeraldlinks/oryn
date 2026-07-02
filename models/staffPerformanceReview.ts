import type { Employee } from "./employee";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface StaffPerformanceReview {

  // @auto;primaryKey
  id?: number;
  // @index;not null
  workspaceId: number;
  // @index;not null
  employeeId: number;
  // @nullable;index
  reviewerId?: number;
  // @length:30;not null
  reviewDate: string;
  // @nullable;length:50
  period?: string;
  // @nullable
  rating?: number;
  // @nullable;json
  goals?: Record<string, unknown>;
  // @nullable
  achievements?: string;
  // @nullable
  areasForImprovement?: string;
  // @nullable
  overallRating?: number;
  // @length:20;default:'draft'
  status: string;
  createdAt?: string;
  updatedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
  // @relation manytoone:User;foreignKey:reviewerId
  reviewer?: User;

}
