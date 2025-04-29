import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeeDocumentById,
  createEmployeeDocument,
  updateEmployeeDocument,
  deleteEmployeeDocument,
} from "../api/employeeDocsApi";
import { EmployeeDocument } from "../types/employee-docs";
import { toast } from "sonner";

export const useEmployeeDocument = (id: string) => {
  return useQuery<EmployeeDocument>({
    queryKey: ["employee-document", id],
    queryFn: () => getEmployeeDocumentById(id),
    enabled: !!id,
  });
};

export const useCreateEmployeeDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployeeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
      toast.success("Document created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEmployeeDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      documentData,
    }: {
      id: string;
      documentData: Partial<EmployeeDocument>;
    }) => updateEmployeeDocument(id, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
      toast.success("Document updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteEmployeeDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployeeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
      toast.success("Document deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
