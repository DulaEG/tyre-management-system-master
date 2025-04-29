import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
} from "../api/employeeApi";
import { Employee } from "../types/employee";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });
};

export const useEmployee = (id: string) => {
  return useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      employeeData,
    }: {
      id: string;
      employeeData: Partial<Employee>;
    }) => updateEmployee(id, employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useEmployeeLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      nic,
      password,
    }: {
      nic: string;
      password: string;
    }) => {
      return await loginEmployee(nic, password);
    },
    onSuccess: (data) => {
      toast.success(`Welcome, ${data.employee.name}!`);

      // Save token & role in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.employee.role);
      localStorage.setItem("employeeId", data.employee.id);
      // ✅ Navigate to admin dashboard after successful login
      if (data.employee.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
