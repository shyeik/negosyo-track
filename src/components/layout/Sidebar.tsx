import {
  BarChart3,
  Home,
  Package,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";

import tracabaoLogo from "../../assets/trackabao.png";

export type PageKey =
  | "dashboard"
  | "sales"
  | "expenses"
  | "inventory"
  | "reports";

type SidebarProps = {
  activePage: PageKey;
  onChangePage: (page: PageKey) => void;
};

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: Home,
  },

  {
    key: "sales",
    label: "Sales",
    icon: ShoppingCart,
  },

  {
    key: "expenses",
    label: "Expenses",
    icon: ReceiptText,
  },

  {
    key: "inventory",
    label: "Inventory",
    icon: Package,
  },

  {
    key: "reports",
    label: "Reports",
    icon: BarChart3,
  },
] as const;

export default function Sidebar({ activePage, onChangePage }: SidebarProps) {
  return (
    <aside className="website-sidebar">
      <div className="sidebar-brand">
        <img src={tracabaoLogo} alt="Trackabao Logo" className="sidebar-logo" />

        <div>
          <h2>Trackabao</h2>

          <p>Smart negosyo tracking.</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive = activePage === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={`sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => onChangePage(item.key)}
            >
              <Icon size={19} />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
