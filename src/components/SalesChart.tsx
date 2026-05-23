import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
  date?: string;
  createdAt?: string;
};

type Expense = {
  _id: string;
  category: string;
  description: string;
  amount: number;
  date?: string;
  createdAt?: string;
};

type ApiListResponse<T> = T[] | { data?: T[]; sales?: T[]; expenses?: T[] };

type ChartItem = {
  day: string;
  benta: number;
  gastos: number;
  net: number;
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const money = (value: number) =>
  `₱${Number(value || 0).toLocaleString("en-PH")}`;

const getList = <T,>(response: ApiListResponse<T> | undefined): T[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.sales)) return response.sales;
  if (Array.isArray(response?.expenses)) return response.expenses;
  return [];
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const benta = Number(
    payload.find((item) => item.dataKey === "benta")?.value || 0,
  );

  const gastos = Number(
    payload.find((item) => item.dataKey === "gastos")?.value || 0,
  );

  const net = benta - gastos;

  return (
    <div className="sales-chart-tooltip">
      <p className="sales-chart-tooltip__day">{label}</p>

      <div className="sales-chart-tooltip__row">
        <span className="dot dot--sales" />
        <span>Benta</span>
        <strong>{money(benta)}</strong>
      </div>

      <div className="sales-chart-tooltip__row">
        <span className="dot dot--expenses" />
        <span>Gastos</span>
        <strong>{money(gastos)}</strong>
      </div>

      <div className="sales-chart-tooltip__divider" />

      <div className="sales-chart-tooltip__row">
        <span className="dot dot--net" />
        <span>Net</span>
        <strong className={net >= 0 ? "positive" : "negative"}>
          {money(net)}
        </strong>
      </div>
    </div>
  );
}

export default function SalesChart() {
  const { data: salesData } = useSales();
  const { data: expensesData } = useExpenses();

  const sales = getList<Sale>(salesData);
  const expenses = getList<Expense>(expensesData);

  const chartData: ChartItem[] = useMemo(() => {
    const weeklyData: ChartItem[] = days.map((day) => ({
      day,
      benta: 0,
      gastos: 0,
      net: 0,
    }));

    sales.forEach((sale) => {
      const saleDate = sale.date || sale.createdAt;
      if (!saleDate) return;

      const dayIndex = new Date(saleDate).getDay();
      weeklyData[dayIndex].benta += Number(sale.amount || 0);
    });

    expenses.forEach((expense) => {
      const expenseDate = expense.date || expense.createdAt;
      if (!expenseDate) return;

      const dayIndex = new Date(expenseDate).getDay();
      weeklyData[dayIndex].gastos += Number(expense.amount || 0);
    });

    return weeklyData.map((item) => ({
      ...item,
      net: item.benta - item.gastos,
    }));
  }, [sales, expenses]);

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.benta += item.benta;
        acc.gastos += item.gastos;
        acc.net += item.net;
        return acc;
      },
      {
        benta: 0,
        gastos: 0,
        net: 0,
      },
    );
  }, [chartData]);

  return (
    <section className="sales-chart">
      <div className="sales-chart__header">
        <div>
          <h3>Weekly Analytics</h3>
          <p>Benta vs gastos from your actual records</p>
        </div>

        <div className="sales-chart__summary">
          <div>
            <span>Total Benta</span>
            <strong>{money(totals.benta)}</strong>
          </div>

          <div>
            <span>Total Gastos</span>
            <strong>{money(totals.gastos)}</strong>
          </div>

          <div>
            <span>Net</span>
            <strong className={totals.net >= 0 ? "positive" : "negative"}>
              {money(totals.net)}
            </strong>
          </div>
        </div>
      </div>

      <div className="sales-chart__body">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={chartData}
            barGap={8}
            barCategoryGap="28%"
            margin={{ top: 20, right: 20, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.12)"
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13, fontWeight: 700 }}
            />

            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fontWeight: 700 }}
              tickFormatter={(value) => money(Number(value))}
            />

            <Tooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
              content={<CustomTooltip />}
            />

            <Legend
              iconType="circle"
              wrapperStyle={{
                paddingTop: 14,
                color: "#cbd5e1",
                fontSize: 13,
                fontWeight: 700,
              }}
            />

            <Bar
              name="Benta"
              dataKey="benta"
              fill="#f59e0b"
              radius={[12, 12, 0, 0]}
              maxBarSize={46}
            />

            <Bar
              name="Gastos"
              dataKey="gastos"
              fill="#ef4444"
              radius={[12, 12, 0, 0]}
              maxBarSize={46}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
