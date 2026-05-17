import { Package, ReceiptText, ShoppingCart, TrendingUp } from "lucide-react";

import InventoryTable from "../components/InventoryTable";
import StatCard from "../components/ui/StatCard";
import SalesChart from "../components/SalesChart";
import SalesTable from "../components/SalesTable";
import "../style/pages/HomePage.css";
import ActivityCard from "../components/ui/ActivityCard";
import ExpensesTable from "../components/ExpensesTable";

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-banner">
        <div>
          <p>NEGOSYOTRACK DASHBOARD</p>

          <h1>Kumusta ang negosyo today?</h1>

          <span>Real-time tracking ng benta, gastos, at stock.</span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Benta"
          value={money(12500)}
          icon={ShoppingCart}
          tone="green"
          hint="Today sales"
        />

        <StatCard
          label="Gastos"
          value={money(8250)}
          icon={ReceiptText}
          tone="red"
          hint="Business expenses"
        />

        <StatCard
          label="Tubo"
          value={money(4250)}
          icon={TrendingUp}
          tone="yellow"
          hint="Estimated profit"
        />

        <StatCard
          label="Top Item"
          value="Kape"
          icon={Package}
          tone="blue"
          hint="Best seller today"
        />
      </section>

      <section className="dashboard-grid">
        <ActivityCard title="Recent Benta" subtitle="Latest sales today">
          <div className="activity-list">
            <div className="activity-row">
              <div>
                <strong>Kape</strong>
                <span>Cash payment</span>
              </div>

              <b>₱120</b>
            </div>

            <div className="activity-row">
              <div>
                <strong>Pandesal</strong>
                <span>GCash payment</span>
              </div>

              <b>₱85</b>
            </div>
          </div>
        </ActivityCard>

        <ActivityCard title="Low Stock Alerts" subtitle="Items needing refill">
          <div className="activity-list">
            <div className="activity-row">
              <div>
                <strong>Sardinas</strong>
                <span>Critical stock</span>
              </div>

              <b>2 left</b>
            </div>

            <div className="activity-row">
              <div>
                <strong>Softdrinks</strong>
                <span>Low inventory</span>
              </div>

              <b>4 left</b>
            </div>
          </div>
        </ActivityCard>
      </section>
      <InventoryTable />
      <ExpensesTable />
      <SalesChart />
      <SalesTable />
    </div>
  );
}
