import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "../style/components/SalesChart.css";

const data = [
  {
    day: "Mon",
    benta: 4200,
    gastos: 1800,
  },
  {
    day: "Tue",
    benta: 5200,
    gastos: 2300,
  },
  {
    day: "Wed",
    benta: 3900,
    gastos: 1700,
  },
  {
    day: "Thu",
    benta: 6400,
    gastos: 3100,
  },
  {
    day: "Fri",
    benta: 7200,
    gastos: 2800,
  },
  {
    day: "Sat",
    benta: 8100,
    gastos: 3600,
  },
  {
    day: "Sun",
    benta: 5600,
    gastos: 2400,
  },
];

export default function SalesChart() {
  return (
    <section className="sales-chart">
      <div className="sales-chart__header">
        <div>
          <h3>Weekly Analytics</h3>

          <p>Benta vs gastos this week</p>
        </div>
      </div>

      <div className="sales-chart__body">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data}>
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

            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />

            <Tooltip
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
