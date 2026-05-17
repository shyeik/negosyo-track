import { Package, ReceiptText, ShoppingCart, TrendingUp } from "lucide-react";

import InventoryTable from "../components/InventoryTable";
import StatCard from "../components/ui/StatCard";
import SalesChart from "../components/SalesChart";
import SalesTable from "../components/SalesTable";
import ActivityCard from "../components/ui/ActivityCard";
import ExpensesTable from "../components/ExpensesTable";

import { useExpenses } from "../hooks/useExpenses";
import { useInventory } from "../hooks/useInventory";
import { useSales } from "../hooks/useSales";

import "../style/pages/HomePage.css";

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

type InventoryItem = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

const today = () => new Date().toISOString().slice(0, 10);

const money = (value: number) =>
  `₱${Number(value || 0).toLocaleString("en-PH")}`;

export default function HomePage() {
  const { data: salesData } = useSales();
  const { data: expensesData } = useExpenses();
  const { data: inventoryData } = useInventory();

  const sales: Sale[] = Array.isArray(salesData) ? salesData : [];
  const expenses: Expense[] = Array.isArray(expensesData) ? expensesData : [];
  const inventory: InventoryItem[] = Array.isArray(inventoryData)
    ? inventoryData
    : [];

  const todayDate = today();

  const todaysSales = sales.filter(
    (sale) => sale.date?.slice(0, 10) === todayDate,
  );

  const todaysExpenses = expenses.filter(
    (expense) => expense.date?.slice(0, 10) === todayDate,
  );

  const totalBenta = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.amount || 0),
    0,
  );

  const totalGastos = todaysExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const totalTubo = totalBenta - totalGastos;

  const topItem = Object.entries(
    todaysSales.reduce<Record<string, number>>((map, sale) => {
      map[sale.item] = (map[sale.item] || 0) + Number(sale.amount || 0);
      return map;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0];

  const lowStockItems = inventory.filter(
    (item) => Number(item.stock || 0) <= Number(item.lowStockLevel || 0),
  );

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div>
          <p>TRACKABAO DASHBOARD</p>

          <h1>Kumusta ang negosyo today?</h1>

          <span>Real-time tracking ng benta, gastos, at stock.</span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Benta"
          value={money(totalBenta)}
          icon={ShoppingCart}
          tone="green"
          hint={`${todaysSales.length} sales today`}
        />

        <StatCard
          label="Gastos"
          value={money(totalGastos)}
          icon={ReceiptText}
          tone="red"
          hint={`${todaysExpenses.length} expenses today`}
        />

        <StatCard
          label="Tubo"
          value={money(totalTubo)}
          icon={TrendingUp}
          tone={totalTubo >= 0 ? "yellow" : "red"}
          hint={totalTubo >= 0 ? "Estimated profit" : "Lugi today"}
        />

        <StatCard
          label="Top Item"
          value={topItem?.[0] || "—"}
          icon={Package}
          tone="blue"
          hint={topItem ? money(topItem[1]) : "No sales today"}
        />
      </section>

      <section className="dashboard-grid">
        <ActivityCard title="Recent Benta" subtitle="Latest sales today">
          <div className="activity-list">
            {todaysSales.slice(0, 5).length === 0 ? (
              <p className="muted">Wala pang benta today.</p>
            ) : (
              todaysSales.slice(0, 5).map((sale) => (
                <div className="activity-row" key={sale._id}>
                  <div>
                    <strong>{sale.item}</strong>
                    <span>{sale.paymentMethod} payment</span>
                  </div>

                  <b>{money(sale.amount)}</b>
                </div>
              ))
            )}
          </div>
        </ActivityCard>

        <ActivityCard title="Low Stock Alerts" subtitle="Items needing refill">
          <div className="activity-list">
            {lowStockItems.slice(0, 5).length === 0 ? (
              <p className="muted">Okay lahat ng stock.</p>
            ) : (
              lowStockItems.slice(0, 5).map((item) => (
                <div className="activity-row" key={item._id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                  </div>

                  <b>{item.stock} left</b>
                </div>
              ))
            )}
          </div>
        </ActivityCard>
      </section>

      <SalesChart />

      <SalesTable />

      <InventoryTable />

      <ExpensesTable />
    </div>
  );
}
