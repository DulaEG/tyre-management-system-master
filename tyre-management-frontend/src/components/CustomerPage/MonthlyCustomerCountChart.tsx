import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Customer } from "@/types/customer";

interface MonthlyCustomerCountChartProps {
  customers: Customer[];
}

const MonthlyCustomerCountChart = ({
  customers,
}: MonthlyCustomerCountChartProps) => {
  // Group customers by month
  const monthlyData = customers.reduce((acc, customer) => {
    const month = new Date(customer.createdAt).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(monthlyData).map((month) => ({
    name: month,
    count: monthlyData[month],
  }));

  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-bold mb-4">Monthly Customer Count</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyCustomerCountChart;
