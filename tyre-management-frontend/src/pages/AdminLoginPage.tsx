import { useState } from "react";
import { useEmployeeLogin } from "../hooks/useEmployee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const { mutate } = useEmployeeLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nic.trim() || !password.trim()) {
      toast.error("NIC and Password are required");
      return;
    }
    mutate({ nic, password });
  };

  return (
    <div className="w-screen flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-5 shadow-lg">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
