import type { Employee } from "./employee";
import type { StaffTrainingCourse } from "./staffTrainingCourse";
import type { Workspace } from "./workspace";

export interface StaffTrainingEnrollment {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  employeeId: number;
 // @index;not null
  courseId: number;
 // @length:30;default:CURRENT_TIMESTAMP
  enrolledAt?: string;
 // @length:20;default:enrolled
  status?: string;
 // @nullable;length:30
  completedAt?: string;
 // @nullable
  score?: number;
 // @nullable;length:500
  certificateUrl?: string;
 // @nullable
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Employee;foreignKey:employeeId
  employee?: Employee;
 // @relation manytoone:StaffTrainingCourse;foreignKey:courseId
  course?: StaffTrainingCourse;

}
