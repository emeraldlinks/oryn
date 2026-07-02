import type { Employee } from "./employee";

export interface Attendance {

 // @auto;primaryKey
  id: number;
 // @index;not null
  employeeId: number;
 // @not null
  clockedInAt: string;
 // @nullable
  clockedOutAt?: string;
 // @nullable
  notes?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Employee;foreignKey:employeeId;onDelete:CASCADE
  employee?: Employee;

}
