import { EmployeeDocument } from "./employee-docs";
import { EmployeeLeave } from "./employee-leaves";

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  nic: string;
  address: string;
  email: string;
  contactNumber: string;
  role: string; // admin, manager, staff
  password: string;
  deleteStatus: boolean;
  createdAt: string;
  updatedAt: string;
  documents?: EmployeeDocument;
  leaves?: EmployeeLeave[];
}
