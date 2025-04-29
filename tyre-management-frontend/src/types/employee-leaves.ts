import { Employee } from "./employee";

export interface EmployeeLeave {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
}
