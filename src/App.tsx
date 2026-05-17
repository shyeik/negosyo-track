import { useState } from "react";

import DashboardLayout from "./components/layout/DashboardLayout";
import type { PageKey } from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");

  return (
    <DashboardLayout activePage={activePage} onChangePage={setActivePage}>
      <Dashboard />
    </DashboardLayout>
  );
}
