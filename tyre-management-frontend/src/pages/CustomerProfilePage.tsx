import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCustomerPassword,
} from "@/api/customerApi";
import NavBar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Loader2, User, LogOut, Trash2 } from "lucide-react";
import { Customer } from "@/types/customer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomerProfilePage = () => {
  const router = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      const id = localStorage.getItem("userId");

      if (!id) {
        router("/login");
        return;
      }

      try {
        const customerData = await getCustomerById(id);
        setCustomer(customerData);
        setFormData({
          name: customerData.name,
          email: customerData.email,
          contactNumber: customerData.contactNumber || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to fetch customer data:", err);
        setError("Failed to load your profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.email || !formData.contactNumber) {
      setError("Name, email, and contact number are required");
      return;
    }

    // Name validation - letters and spaces only
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError("Name can only contain letters and spaces");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Phone validation - exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setUpdateLoading(true);

      if (customer) {
        // Actual API call to update the customer data
        const updatedCustomer = await updateCustomer(customer.id, {
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
        });

        // Update customer state with new data
        setCustomer(updatedCustomer);
      }

      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All password fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setUpdateLoading(true);

      if (customer) {
        // Actual API call to update the password
        await updateCustomerPassword(customer.id, formData.newPassword);
      }

      setSuccess("Password updated successfully");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Failed to update password:", err);
      setError(
        "Failed to update password. Please check your current password and try again."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!customer) return;

    try {
      setDeleteLoading(true);

      // Actual API call to delete the customer account
      await deleteCustomer(customer.id);

      // Clean up local storage and redirect to login
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userToken");
      router("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError("Failed to delete your account. Please try again later.");
      setShowDeleteDialog(false);
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");
    router("/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white w-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4 bg-gray-700" />
            <Skeleton className="h-6 w-1/2 mb-8 bg-gray-700" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="h-64 w-full rounded-lg bg-gray-700" />
              </div>
              <div className="md:col-span-3">
                <Skeleton className="h-10 w-full mb-4 bg-gray-700" />
                <Skeleton className="h-32 w-full mb-4 bg-gray-700" />
                <Skeleton className="h-32 w-full bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white w-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400 mb-8">
            Manage your account information and preferences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-1"
            >
              <Card className="bg-gray-800 border-gray-700 shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src="" alt={customer?.name} />
                      <AvatarFallback className="bg-red-600 text-white text-xl">
                        {customer?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold mb-1 text-white">
                      {customer?.name}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 ">
                      {customer?.email}
                    </p>
                    <div className="w-full border-t border-gray-700 my-4"></div>
                    <div className="w-full space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-700 text-gray-300"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>

                      <Button
                        variant="destructive"
                        className="w-full justify-start mt-4"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>

                      <Button
                        variant="destructive"
                        className="w-full justify-start mt-4"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-3"
            >
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 bg-gray-800">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-red-600 text-white"
                  >
                    Profile Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-red-600 text-white"
                  >
                    Security
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your account information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert
                          variant="destructive"
                          className="mb-6 bg-red-900 border-red-800"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert className="mb-6 bg-green-900 border-green-800">
                          <AlertDescription className="text-green-300">
                            {success}
                          </AlertDescription>
                        </Alert>
                      )}
                      <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-300">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={updateLoading}
                            className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-300">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={updateLoading}
                            className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="contactNumber"
                            className="text-gray-300"
                          >
                            Phone Number
                          </Label>
                          <Input
                            id="contactNumber"
                            name="contactNumber"
                            placeholder="1234567890"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            disabled={updateLoading}
                            className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500 text-white"
                          />
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700"
                            disabled={updateLoading}
                          >
                            {updateLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Profile"
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card className="bg-gray-800 border-gray-700 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Security</CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your password
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert
                          variant="destructive"
                          className="mb-6 bg-red-900 border-red-800 text-white"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert className="mb-6 bg-green-900 border-green-800">
                          <AlertDescription className="text-green-300 ">
                            {success}
                          </AlertDescription>
                        </Alert>
                      )}
                      <form
                        onSubmit={handleUpdatePassword}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor="currentPassword"
                            className="text-gray-300"
                          >
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            disabled={updateLoading}
                            className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="newPassword"
                            className="text-gray-300"
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.newPassword}
                            onChange={handleChange}
                            disabled={updateLoading}
                            className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-gray-300"
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={updateLoading}
                            className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                          />
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700"
                            disabled={updateLoading}
                          >
                            {updateLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Password"
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerProfilePage;
