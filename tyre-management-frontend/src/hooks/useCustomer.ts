// src/hooks/useCustomer.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
} from "../api/customerApi";
import { Customer } from "../types/customer";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
  });
};

export const useCustomer = (id: string) => {
  return useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      customerData,
    }: {
      id: string;
      customerData: Partial<Customer>;
    }) => updateCustomer(id, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useCustomerLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await loginCustomer(email, password);
    },
    onSuccess: (data) => {
      toast.success(`Welcome, ${data.customer.name}!`);

      // Save token in local storage
      localStorage.setItem("token", data.token);

      // Navigate to customer dashboard after successful login
      navigate("/customer-dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
