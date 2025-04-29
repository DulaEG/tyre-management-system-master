import {
  Home,
  Users,
  ClipboardList,
  ShoppingCart,
  FileText,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface SidebarProps {
  onMenuItemClicked: (key: string) => void;
  activeKey: string;
}

const menuItems = [
  { key: "customer", label: "Customer Management", icon: Users },
  { key: "employee", label: "Employee Management", icon: Home },
  { key: "leave", label: "Leave Management", icon: ClipboardList },
  { key: "stock", label: "Stock Management", icon: ShoppingCart },
  { key: "order", label: "Order Management", icon: FileText },
  { key: "feedback", label: "Feedback Management", icon: MessageSquare },
  { key: "payment", label: "Payment Management", icon: CreditCard },
  // { key: "documentation", label: "Employee Documentation", icon: Folder },
];

const Sidebar = ({ onMenuItemClicked, activeKey }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-2">
        {menuItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-2 rounded-lg transition",
              activeKey === key ? "bg-blue-500 text-white" : "hover:bg-gray-700"
            )}
            onClick={() => onMenuItemClicked(key)}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.replace("/");
          }}
        >
          Logout
        </Button>
      </nav>
    </div>
  );
};

export default Sidebar;
