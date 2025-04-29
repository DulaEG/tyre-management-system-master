import React, { useState, useMemo } from "react";
import { EmployeeLeave } from "@/types/employee-leaves";
import {
  useCreateEmployeeLeave,
  useUpdateEmployeeLeave,
} from "@/hooks/useEmployeeLeaves";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployee";

interface CreateEditEmployeeLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeLeave?: EmployeeLeave | null;
}

// Helper function to format dates for API submission
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString();
};

// Helper function to format dates from API for form display
const formatDateForForm = (isoDateString: string): string => {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  return date.toISOString().split("T")[0];
};

const CreateEditEmployeeLeaveModal = ({
  isOpen,
  onClose,
  employeeLeave,
}: CreateEditEmployeeLeaveModalProps) => {
  // Use useMemo to derive initial formData based on employeeLeave
  const initialFormData = useMemo(() => {
    if (employeeLeave) {
      console.log("Employee Leave Prop:", employeeLeave);
      return {
        employeeId: employeeLeave.employeeId,
        startDate: formatDateForForm(employeeLeave.startDate),
        endDate: formatDateForForm(employeeLeave.endDate),
        status: employeeLeave.status,
        reason: employeeLeave.reason,
      };
    } else {
      console.log("No Employee Leave Prop - Using Default Form Data");
      return {
        employeeId: "",
        startDate: "",
        endDate: "",
        status: "pending",
        reason: "",
      };
    }
  }, [employeeLeave]);

  const [formData, setFormData] = useState(initialFormData);

  // Fetch employees for the dropdown
  const { data: employees } = useEmployees();

  // Create and update mutations
  const createEmployeeLeaveMutation = useCreateEmployeeLeave();
  const updateEmployeeLeaveMutation = useUpdateEmployeeLeave();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data with properly formatted dates
      const submissionData = {
        ...formData,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
      };

      if (employeeLeave) {
        // Update employee leave
        await updateEmployeeLeaveMutation.mutateAsync({
          id: employeeLeave.id,
          leaveData: submissionData,
        });
        toast.success("Employee leave updated successfully!");
      } else {
        // Create employee leave
        await createEmployeeLeaveMutation.mutateAsync(submissionData);
        toast.success("Employee leave created successfully!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save employee leave.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {employeeLeave ? "Edit Employee Leave" : "Create Employee Leave"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={formData.employeeId}
            onValueChange={(value) =>
              setFormData({ ...formData, employeeId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder="End Date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <div className="flex justify-end space-x-2">
            <Button
              style={{ color: "white" }}
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">{employeeLeave ? "Update" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditEmployeeLeaveModal;
