import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Payment } from "@/types/payment";

interface PaymentChartsProps {
  payments: Payment[];
}

const PaymentCharts = ({ payments }: PaymentChartsProps) => {
  // Monthly payment data
  const monthlyData = payments.reduce((acc, payment) => {
    const month = new Date(payment.paidDate).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += payment.paidAmount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.keys(monthlyData).map((month) => ({
    name: month,
    amount: monthlyData[month],
  }));

  // Yearly payment data
  const yearlyData = payments.reduce((acc, payment) => {
    const year = new Date(payment.paidDate).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = 0;
    }
    acc[year] += payment.paidAmount;
    return acc;
  }, {} as Record<string, number>);

  const yearlyChartData = Object.keys(yearlyData).map((year) => ({
    name: year,
    amount: yearlyData[year],
  }));

  // Payment type distribution (Pie Chart)
  const paymentTypeData = payments.reduce((acc, payment) => {
    if (!acc[payment.paymentType]) {
      acc[payment.paymentType] = 0;
    }
    acc[payment.paymentType] += payment.paidAmount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(paymentTypeData).map((type) => ({
    name: type,
    value: paymentTypeData[type],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-8 flex-1 flex">
      <div>
        <h3 className="text-lg font-bold mb-4">Monthly Payments</h3>
        <BarChart width={500} height={300} data={monthlyChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Yearly Payments</h3>
        <BarChart width={500} height={300} data={yearlyChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Payment Type Distribution</h3>
        <PieChart width={500} height={300}>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default PaymentCharts;
