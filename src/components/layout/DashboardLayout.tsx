import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar, { type PageKey } from "./Sidebar";

type DashboardLayoutProps = {
  activePage: PageKey;
  onChangePage: (page: PageKey) => void;
  children: ReactNode;
};

export default function DashboardLayout({
  activePage,
  onChangePage,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="website-shell">
      <Sidebar activePage={activePage} onChangePage={onChangePage} />

      <section className="website-main">
        <Header />

        <main className="website-content">{children}</main>
      </section>
    </div>
  );
}
