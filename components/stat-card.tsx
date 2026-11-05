import { CountUp } from "@/components/count-up";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "accent",
}: {
  label: string;
  value: number;
  sub?: string;
  icon?: React.ReactNode;
  accent?: "accent" | "positive" | "foreground";
}) {
  const accentClass =
    accent === "positive" ? "text-positive" : accent === "foreground" ? "text-foreground" : "text-accent";
  const barClass =
    accent === "positive" ? "bg-positive" : accent === "foreground" ? "bg-foreground/50" : "bg-accent";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-surface p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-border/0 motion-safe:hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${barClass}`} />
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
        {icon && <div className={`${accentClass} opacity-70`}>{icon}</div>}
      </div>
      <div className={`mt-1 font-display text-4xl font-bold ${accentClass}`}>
        <CountUp value={value} />
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}
