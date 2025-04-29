// src/pages/EmployeeLeaveManagementPage.tsx

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";

import { EmployeeLeave } from "@/types/employee-leaves";
import {
  useEmployeeLeaves,
  useDeleteEmployeeLeave,
} from "@/hooks/useEmployeeLeaves";
import { toast } from "sonner";
import EmployeeLeaveTable from "@/components/EmployeeLeavePage/EmployeeLeaveTable";
import CreateEditEmployeeLeaveModal from "@/components/EmployeeLeavePage/CreateEditEmployeeLeaveModal";
import { updateEmployeeLeave } from "@/api/employeeLeavesApi";
import { EmailOptions, sendEmailApi } from "@/api/emailApi";

const EmployeeLeaveManagementPage = () => {
  const [state, setState] = useState({
    createEditButtonOpened: false,
    selectedEmployeeLeave: null as EmployeeLeave | null,
  });

  // Fetch all employee leaves
  const {
    data: employeeLeaves,
    isLoading,
    isError,
    refetch,
  } = useEmployeeLeaves();

  // Delete employee leave mutation
  const deleteEmployeeLeaveMutation = useDeleteEmployeeLeave();

  // Handle delete employee leave
  const handleDeleteEmployeeLeave = async (id: string) => {
    try {
      await deleteEmployeeLeaveMutation.mutateAsync(id);
      await refetch();
      toast.success("Employee leave deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete employee leave.");
    }
  };

  // Handle edit employee leave
  const handleEditEmployeeLeave = async (employeeLeave: EmployeeLeave) => {
    await updateEmployeeLeave(employeeLeave.id, {
      status: employeeLeave.status,
    });
    await refetch();
    try {
      const options: EmailOptions = {
        to: employeeLeave.employee.email,
        subject: "Your Leave Request Has Been Approved - Tyrezone",
        text: "Your leave request has been approved. Enjoy your time off!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #4CAF50; text-align: center;">Leave Request Approved</h2>
              <p>Dear ${employeeLeave.employee?.name},</p>
              <p>We are pleased to inform you that your leave request from <strong>${employeeLeave?.startDate}</strong> to <strong>${employeeLeave?.endDate}</strong> has been approved.</p>
              <p>Enjoy your time off, and we look forward to welcoming you back!</p>
              <p>If you have any concerns, feel free to reach out.</p>
              <p>Best regards,<br/><strong>HR Team, Tyrezone</strong></p>
            </div>
          `,
      };

      await sendEmailApi(options);
    } catch (error) {
      console.error(`Error sending the mail ${error}`);
    }
  };

  // Handle create/edit modal close
  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      createEditButtonOpened: false,
      selectedEmployeeLeave: null,
    }));
  };

  return (
    <div className="w-full h-full p-4">
      <PageHeader
        title="Employee Leave Management"
        onCreateButtonClick={null}
      />
      <EmployeeLeaveTable
        employeeLeaves={employeeLeaves || []}
        onEdit={handleEditEmployeeLeave}
        onDelete={handleDeleteEmployeeLeave}
        isLoading={isLoading}
        isError={isError}
      />
      <CreateEditEmployeeLeaveModal
        isOpen={state.createEditButtonOpened}
        onClose={handleModalClose}
        employeeLeave={state.selectedEmployeeLeave}
      />
    </div>
  );
};

export default EmployeeLeaveManagementPage;
