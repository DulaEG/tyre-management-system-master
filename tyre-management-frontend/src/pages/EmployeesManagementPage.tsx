import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import CreateEditEmployeeModal from "@/components/EmployeePage/CreateEditEmployeeModal";
import EmployeeTable from "@/components/EmployeePage/EmployeeTable";
import { Employee } from "@/types/employee";
import { useEmployees, useDeleteEmployee } from "@/hooks/useEmployee";
import { toast } from "sonner";

const EmployeesManagementPage = () => {
  const [state, setState] = useState({
    createEditButtonOpened: false,
    selectedEmployee: null as Employee | null,
  });

  // Fetch all employees
  const { data: employees, isLoading, isError } = useEmployees();

  // Delete employee mutation
  const deleteEmployeeMutation = useDeleteEmployee();

  // Handle delete employee
  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployeeMutation.mutateAsync(id);
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete employee.");
    }
  };

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setState((prev) => ({
      ...prev,
      selectedEmployee: employee,
      createEditButtonOpened: true,
    }));
  };

  // Handle create/edit modal close
  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      createEditButtonOpened: false,
      selectedEmployee: null,
    }));
  };

  return (
    <div className="w-full h-full p-4">
      <PageHeader
        title="Employee Management"
        onCreateButtonClick={() =>
          setState((prev) => ({ ...prev, createEditButtonOpened: true }))
        }
      />
      <EmployeeTable
        employees={employees || []}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        isLoading={isLoading}
        isError={isError}
      />
      <CreateEditEmployeeModal
        isOpen={state.createEditButtonOpened}
        onClose={handleModalClose}
        employee={state.selectedEmployee}
      />
    </div>
  );
};

export default EmployeesManagementPage;
