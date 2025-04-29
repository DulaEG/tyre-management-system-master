import React, { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface CreateEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

const CreateEditCustomerModal = ({
  isOpen,
  onClose,
  customer,
}: CreateEditCustomerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data if editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        contactNumber: customer.contactNumber || "",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
      });
    }
    // Reset errors when modal opens/changes
    setErrors({
      name: "",
      email: "",
      contactNumber: "",
      password: "",
    });
  }, [customer, isOpen]);

  // Create and update mutations
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
    };

    // Validate name (letters and spaces only)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate phone number (10 digits)
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Validate password (only for new customers)
    if (!customer && !formData.password) {
      newErrors.password = "Password is required for new customers";
      isValid = false;
    } else if (!customer && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (customer) {
        // Update customer
        await updateCustomerMutation.mutateAsync({
          id: customer.id,
          customerData: formData,
        });
        toast.success("Customer updated successfully!");
      } else {
        // Create customer
        await createCustomerMutation.mutateAsync(formData);
        toast.success("Customer created successfully!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {customer ? "Edit Customer" : "Create Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              placeholder="10-digit number"
              value={formData.contactNumber}
              onChange={handleChange}
              className={errors.contactNumber ? "border-red-500" : ""}
            />
            {errors.contactNumber && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.contactNumber}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={customer ? "••••••" : "Enter password"}
              disabled={customer != null}
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </div>
            )}
            {customer && (
              <p className="text-gray-500 text-xs">
                Password cannot be changed here. Use the reset password feature
                instead.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              style={{ color: "white" }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : customer ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditCustomerModal;
