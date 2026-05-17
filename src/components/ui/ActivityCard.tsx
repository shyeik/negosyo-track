import "../../style/ui/ActivityCard.css";

type ActivityCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function ActivityCard({
  title,
  subtitle,
  children,
}: ActivityCardProps) {
  return (
    <section className="activity-card">
      <div className="activity-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="activity-card__content">{children}</div>
    </section>
  );
}
