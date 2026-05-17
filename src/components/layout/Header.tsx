import { CalendarDays } from "lucide-react";
import "../../style/components/layout/Header.css";

export default function Header() {
  const today = new Date().toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="minimal-header">
      <div>
        <p className="minimal-label">TRACKABAO</p>
        <h1>Dashboard</h1>
      </div>

      <div className="minimal-date">
        <CalendarDays size={16} />
        <span>{today}</span>
      </div>
    </header>
  );
}
