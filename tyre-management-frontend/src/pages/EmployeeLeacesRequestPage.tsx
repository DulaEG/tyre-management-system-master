import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import {
  getAllEmployeeLeaves,
  createEmployeeLeave,
  deleteEmployeeLeave,
  updateEmployeeLeave,
} from "@/api/employeeLeavesApi";
import { EmployeeLeave } from "@/types/employee-leaves";
import { toast } from "sonner";
import { Edit, Trash, Plus } from "lucide-react";

const EmployeeLeavesRequestPage = () => {
  const employeeId = localStorage.getItem("employeeId");
  const [leaves, setLeaves] = useState<EmployeeLeave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<EmployeeLeave[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<EmployeeLeave | null>(null);
  const [newLeave, setNewLeave] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    reason: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getAllEmployeeLeaves();
      const employeeLeaves = data.filter(
        (leave: EmployeeLeave) => leave.employeeId === employeeId
      );
      setLeaves(employeeLeaves);
      setFilteredLeaves(employeeLeaves);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeave = async () => {
    if (!newLeave.startDate || !newLeave.endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (newLeave.endDate <= newLeave.startDate) {
      toast.error("End date must be after the start date.");
      return;
    }

    try {
      await createEmployeeLeave({
        ...newLeave,
        employeeId,
        status: "pending",
      });
      setIsDialogOpen(false);
      setNewLeave({ startDate: null, endDate: null, reason: "" });
      fetchLeaves();
      toast.success("Leave request created successfully!");
    } catch (error) {
      console.error("Failed to create leave:", error);
      toast.error("Failed to create leave request.");
    }
  };

  const handleUpdateLeave = async () => {
    if (editingLeave) {
      if (editingLeave.endDate <= editingLeave.startDate) {
        toast.error("End date must be after the start date.");
        return;
      }

      try {
        const { id, employeeId, employee, ...dataWithoutId } = editingLeave;
        await updateEmployeeLeave(id, {
          ...dataWithoutId,
          status: "pending",
        });
        setEditingLeave(null);
        fetchLeaves();
        toast.success("Leave request updated successfully!");
      } catch (error) {
        console.error("Failed to update leave:", error);
        toast.error("Failed to update leave request.");
      }
    }
  };

  const handleDeleteLeave = async (id: string) => {
    try {
      await deleteEmployeeLeave(id);
      fetchLeaves();
      toast.success("Leave request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete leave:", error);
      toast.error("Failed to delete leave request.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold" style={{ fontSize: 24 }}>
          Employee Leave Requests
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" /> Create Leave Request
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create Leave Request</DialogTitle>
              <DialogDescription>
                Fill out the form to request a leave.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Start Date:</p>
                  <Calendar
                    mode="single"
                    selected={newLeave.startDate}
                    onSelect={(date) =>
                      setNewLeave({ ...newLeave, startDate: date || null })
                    }
                    className="rounded-md border text-white"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">End Date:</p>
                  <Calendar
                    mode="single"
                    selected={newLeave.endDate}
                    onSelect={(date) =>
                      setNewLeave({ ...newLeave, endDate: date || null })
                    }
                    className="rounded-md border text-white"
                    disabled={(date) =>
                      !!newLeave.startDate && date <= newLeave.startDate
                    }
                  />
                </div>
              </div>
              <Textarea
                placeholder="Reason"
                value={newLeave.reason}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, reason: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateLeave}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>
                {new Date(leave.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(leave.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell>
                {leave.status !== "accepted" && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      style={{ color: "white" }}
                      onClick={() => setEditingLeave(leave)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      style={{ color: "white" }}
                      onClick={() => handleDeleteLeave(leave.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingLeave && (
        <Dialog
          open={!!editingLeave}
          onOpenChange={(open) => !open && setEditingLeave(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Leave Request</DialogTitle>
              <DialogDescription>Update your leave request.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Start Date:</p>
                  <Calendar
                    mode="single"
                    selected={editingLeave.startDate}
                    onSelect={(date) =>
                      setEditingLeave({
                        ...editingLeave,
                        startDate: date || editingLeave.startDate,
                      })
                    }
                    className="rounded-md border"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">End Date:</p>
                  <Calendar
                    mode="single"
                    selected={editingLeave.endDate}
                    onSelect={(date) =>
                      setEditingLeave({
                        ...editingLeave,
                        endDate: date || editingLeave.endDate,
                      })
                    }
                    className="rounded-md border"
                    disabled={(date) =>
                      !!editingLeave.startDate && date <= editingLeave.startDate
                    }
                  />
                </div>
              </div>
              <Textarea
                placeholder="Reason"
                value={editingLeave.reason}
                onChange={(e) =>
                  setEditingLeave({ ...editingLeave, reason: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateLeave}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeLeavesRequestPage;
