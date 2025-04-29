import { useState } from "react";
import { createCustomer } from "@/api/customerApi";
import NavBar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmailOptions, sendEmailApi } from "@/api/emailApi";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.contactNumber
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Create customer using API
      const customerData = {
        customerId: `CUS${Date.now()}`, // Generate a unique customer ID
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        deleteStatus: false,
        payments: [],
        orders: [],
        feedbacks: [],
      };

      await createCustomer(customerData);

      try {
        const options: EmailOptions = {
          to: customerData.email,
          subject: "Welcome to Tyrezone – Your Journey Starts Here!",
          text: "Thank you for joining Tyrezone! We're excited to have you on board.",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #4CAF50; text-align: center;">Welcome to Tyrezone!</h2>
              <p>Hi ${customerData.name},</p>
              <p>We're thrilled to have you as part of the Tyrezone family. Whether you're looking for high-quality tyres or expert advice, we've got you covered.</p>
              <p>Start exploring our latest offers and products:</p>
              <p style="text-align: center;">
                <a href="https://www.tyrezone.com" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Tyrezone</a>
              </p>
              <p>Need assistance? Our team is always here to help.</p>
              <p>Drive safe,<br/><strong>The Tyrezone Team</strong></p>
            </div>
          `,
        };

        await sendEmailApi(options);
      } catch (error) {
        console.error(`Error sending the email ${error}`);
      }

      // Show success message or redirect to login page
      router("/login?registered=true");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        // Handle axios error
        const axiosError = err as any;
        setError(axiosError.response?.data?.message || "Registration failed");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Register to start shopping for premium tires
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
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
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="1234567890"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-700 pt-4">
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Sign in
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
