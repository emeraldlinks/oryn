import type { Employee } from "./employee";
import type { User } from "./user";

export interface LeaveRequest {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  employeeId: number;
 // @enum:(vacation,sick,personal,other);not null
  type: string;
 // @not null
  startDate: string;
 // @not null
  endDate: string;
 // @default:pending;enum:(pending,approved,rejected,cancelled)
  status: string;
 // @nullable
  reason?: string;
 // @nullable;index
  approvedBy?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Employee;foreignKey:employeeId;onDelete:CASCADE
  employee?: Employee;
 // @relation manytoone:User;foreignKey:approvedBy
  approver?: User;

}
