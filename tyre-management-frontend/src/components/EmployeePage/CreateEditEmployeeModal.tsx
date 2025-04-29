import { useEffect } from "react";
import { Employee } from "@/types/employee";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployee";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CreateEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

// Create a schema for form validation
const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nic: z.string().min(1, "NIC is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().optional(),
  email: z.string().email(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const CreateEditEmployeeModal = ({
  isOpen,
  onClose,
  employee,
}: CreateEditEmployeeModalProps) => {
  // Initialize form with react-hook-form
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      nic: "",
      address: "",
      contactNumber: "",
      role: "staff",
      password: "",
      email: "",
    },
  });

  // Initialize form data if editing
  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        nic: employee.nic,
        address: employee.address,
        contactNumber: employee.contactNumber,
        role: employee.role,
        password: employee.password,
        email: employee.email,
      });
    } else {
      form.reset({
        name: "",
        nic: "",
        address: "",
        contactNumber: "",
        role: "staff",
        password: "",
        email: "",
      });
    }
  }, [employee, form]);

  // Create and update mutations
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  // Handle form submission
  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      if (employee) {
        // Update employee
        await updateEmployeeMutation.mutateAsync({
          id: employee.id,
          employeeData: data,
        });
        toast.success("Employee updated successfully!");
      } else {
        // Create employee
        await createEmployeeMutation.mutateAsync(data);
        toast.success("Employee created successfully!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save employee.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Create Employee"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIC</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter NIC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger style={{ background: "white" }}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      disabled={employee != null}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                className="text-white"
                style={{ color: "white" }}
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="text-white"
                style={{ color: "white" }}
                type="submit"
                disabled={
                  createEmployeeMutation.isPending ||
                  updateEmployeeMutation.isPending
                }
              >
                {employee ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditEmployeeModal;
