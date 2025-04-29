import { BrowserRouter, Route, Routes } from "react-router-dom";
import CustomerHomePage from "./pages/CustomerHomePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import SingleItemPage from "./pages/SingleItemPage";
import PaymentPage from "./pages/PaymentPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CustomerPaymentPage from "./pages/CustomerPaymentPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  const role = localStorage.getItem("role");
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerHomePage />} path="/" />
        <Route element={<CustomerLoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<CustomerProfilePage />} path="/profile" />
        <Route element={<SingleItemPage />} path="/item-view/:id" />
        <Route element={<PaymentPage />} path="/payment-view/:id" />
        <Route element={<CustomerPaymentPage />} path="/my-payments" />
        <Route element={<EmployeeDashboard />} path="/employee-dashboard" />
        <Route element={<MyOrdersPage />} path="/cart" />
        <Route element={<AdminLoginPage />} path="/admin-login" />

        {role === "admin" && (
          <>
            <Route element={<AdminDashboardPage />} path="/admin-dashboard" />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
