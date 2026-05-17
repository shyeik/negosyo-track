import type { LucideIcon } from "lucide-react";
import "../../style/ui/Statcard.css";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "green" | "red" | "yellow" | "blue";
  hint?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  hint,
}: StatCardProps) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-card__icon">
        <Icon size={22} />
      </div>

      <div className="stat-card__content">
        <p>{label}</p>

        <h3>{value}</h3>

        {hint && <span>{hint}</span>}
      </div>
    </article>
  );
}
