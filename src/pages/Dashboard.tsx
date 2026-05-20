import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { socket } from "../lib/socket";

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

const money = (value: number) =>
  `₱${Number(value || 0).toLocaleString("en-PH")}`;

export default function HomePage() {
  const queryClient = useQueryClient();

  const { data: salesData, isLoading: salesLoading } = useSales();
  const { data: expensesData, isLoading: expensesLoading } = useExpenses();
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();

  useEffect(() => {
    const refreshSales = () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    };

    const refreshExpenses = () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    };

    const refreshInventory = () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    };

    socket.on("sales:changed", refreshSales);
    socket.on("expenses:changed", refreshExpenses);
    socket.on("inventory:changed", refreshInventory);

    return () => {
      socket.off("sales:changed", refreshSales);
      socket.off("expenses:changed", refreshExpenses);
      socket.off("inventory:changed", refreshInventory);
    };
  }, [queryClient]);

  const sales: Sale[] = Array.isArray(salesData) ? salesData : [];
  const expenses: Expense[] = Array.isArray(expensesData) ? expensesData : [];
  const inventory: InventoryItem[] = Array.isArray(inventoryData)
    ? inventoryData
    : [];

  const dashboardData = useMemo(() => {
    const totalBenta = sales.reduce(
      (sum, sale) => sum + Number(sale.amount || 0),
      0,
    );

    const totalGastos = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0,
    );

    const totalTubo = totalBenta - totalGastos;

    const topItem = Object.entries(
      sales.reduce<Record<string, number>>((map, sale) => {
        map[sale.item] = (map[sale.item] || 0) + Number(sale.amount || 0);
        return map;
      }, {}),
    ).sort((a, b) => b[1] - a[1])[0];

    const lowStockItems = inventory.filter(
      (item) => Number(item.stock || 0) <= Number(item.lowStockLevel || 0),
    );

    return {
      sales,
      expenses,
      totalBenta,
      totalGastos,
      totalTubo,
      topItem,
      lowStockItems,
    };
  }, [sales, expenses, inventory]);

  const isLoading = salesLoading || expensesLoading || inventoryLoading;

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div>
          <p>TRACKABAO DASHBOARD</p>
          <h1>Kumusta ang negosyo today?</h1>
          <span>
            {isLoading
              ? "Loading latest business data..."
              : "Real-time tracking ng benta, gastos, at stock."}
          </span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Benta"
          value={money(dashboardData.totalBenta)}
          icon={ShoppingCart}
          tone="green"
          hint={`${dashboardData.sales.length} total sales`}
        />

        <StatCard
          label="Gastos"
          value={money(dashboardData.totalGastos)}
          icon={ReceiptText}
          tone="red"
          hint={`${dashboardData.expenses.length} total expenses`}
        />

        <StatCard
          label="Tubo"
          value={money(dashboardData.totalTubo)}
          icon={TrendingUp}
          tone={dashboardData.totalTubo >= 0 ? "yellow" : "red"}
          hint={dashboardData.totalTubo >= 0 ? "Estimated profit" : "Lugi"}
        />

        <StatCard
          label="Top Item"
          value={dashboardData.topItem?.[0] || "—"}
          icon={Package}
          tone="blue"
          hint={
            dashboardData.topItem
              ? money(dashboardData.topItem[1])
              : "No sales yet"
          }
        />
      </section>

      <section className="dashboard-grid">
        <ActivityCard title="Recent Benta" subtitle="Latest sales">
          <div className="activity-list">
            {dashboardData.sales.slice(0, 5).length === 0 ? (
              <p className="muted">Wala pang benta.</p>
            ) : (
              dashboardData.sales.slice(0, 5).map((sale) => (
                <div className="activity-row" key={sale._id}>
                  <div>
                    <strong>{sale.item}</strong>
                    <span>
                      {sale.qty} qty • {sale.paymentMethod} payment
                    </span>
                  </div>

                  <b>{money(sale.amount)}</b>
                </div>
              ))
            )}
          </div>
        </ActivityCard>

        <ActivityCard title="Low Stock Alerts" subtitle="Items needing refill">
          <div className="activity-list">
            {dashboardData.lowStockItems.slice(0, 5).length === 0 ? (
              <p className="muted">Okay lahat ng stock.</p>
            ) : (
              dashboardData.lowStockItems.slice(0, 5).map((item) => (
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
