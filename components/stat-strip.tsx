import { CountUp } from "@/components/count-up";

const COLORS = ["text-accent", "text-positive", "text-foreground", "text-muted"];
const BARS = ["bg-accent", "bg-positive", "bg-foreground/50", "bg-muted"];

export function StatStrip({
  stats,
}: {
  stats: { label: string; value: number; icon?: React.ReactNode }[];
}) {
  return (
    <div className="pitwall-grid grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-y border-border bg-surface">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="group relative z-10 px-4 py-6 text-center sm:text-left transition-colors hover:bg-surface-raised/60"
        >
          <div className={`absolute inset-x-0 top-0 h-0.5 ${BARS[i % BARS.length]} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {stat.icon && <span className={`${COLORS[i % COLORS.length]} opacity-70`}>{stat.icon}</span>}
            <div className={`font-display text-3xl sm:text-4xl font-bold ${COLORS[i % COLORS.length]}`}>
              <CountUp value={stat.value} />
            </div>
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
