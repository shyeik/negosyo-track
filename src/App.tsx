import { useState } from "react";

import DashboardLayout from "./components/layout/DashboardLayout";
import type { PageKey } from "./components/layout/Sidebar";

import HomePage from "./pages/Homepage";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("home");

  return (
    <DashboardLayout activePage={activePage} onChangePage={setActivePage}>
      <HomePage />
    </DashboardLayout>
  );
}
