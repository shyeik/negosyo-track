import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useExpenses } from "../hooks/useExpenses";
import { useSales } from "../hooks/useSales";

import "../style/components/SalesChart.css";

type Sale = {
  _id: string;
  item: string;
  amount: number;
  qty: number;
  paymentMethod: "Cash" | "GCash" | "Maya" | "Card";
  date: string;
};

type Expense = {
  _id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const money = (value: number) =>
  `₱${Number(value || 0).toLocaleString("en-PH")}`;

export default function SalesChart() {
  const { data: salesData } = useSales();
  const { data: expensesData } = useExpenses();

  const sales: Sale[] = Array.isArray(salesData) ? salesData : [];
  const expenses: Expense[] = Array.isArray(expensesData) ? expensesData : [];

  const chartData = useMemo(() => {
    const weeklyData = days.map((day) => ({
      day,
      benta: 0,
      gastos: 0,
    }));

    sales.forEach((sale) => {
      if (!sale.date) return;

      const dayIndex = new Date(sale.date).getDay();

      weeklyData[dayIndex].benta += Number(sale.amount || 0);
    });

    expenses.forEach((expense) => {
      if (!expense.date) return;

      const dayIndex = new Date(expense.date).getDay();

      weeklyData[dayIndex].gastos += Number(expense.amount || 0);
    });

    return weeklyData;
  }, [sales, expenses]);

  return (
    <section className="sales-chart">
      <div className="sales-chart__header">
        <div>
          <h3>Weekly Analytics</h3>
          <p>Benta vs gastos from your actual records</p>
        </div>
      </div>

      <div className="sales-chart__body">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.1)"
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₱${value}`}
            />

            <Tooltip
              formatter={(value) => money(Number(value))}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148,163,184,0.14)",
                borderRadius: "16px",
                color: "#fff",
              }}
            />

            <Bar dataKey="benta" radius={[10, 10, 0, 0]} fill="#f59e0b" />

            <Bar dataKey="gastos" radius={[10, 10, 0, 0]} fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
