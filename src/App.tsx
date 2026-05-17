import { useState } from "react";

import DashboardLayout from "./components/layout/DashboardLayout";

import type { PageKey } from "./components/layout/Sidebar";
import SalesPage from "./pages/SalesPage";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import ExpensesPage from "./pages/ExpensesPage";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");

  return (
    <DashboardLayout activePage={activePage} onChangePage={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}

      {activePage === "sales" && <SalesPage />}
      {activePage === "inventory" && <InventoryPage />}
      {activePage === "expenses" && <ExpensesPage />}
      {activePage === "reports" && (
        <section className="panel">
          <h2>Ulat</h2>
          <p className="muted">Reports and analytics page.</p>
        </section>
      )}
    </DashboardLayout>
  );
}
