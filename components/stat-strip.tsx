const COLORS = ["text-accent", "text-positive", "text-foreground", "text-muted"];

export function StatStrip({
  stats,
}: {
  stats: { label: string; value: string | number }[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-y border-border bg-surface">
      {stats.map((stat, i) => (
        <div key={stat.label} className="px-4 py-6 text-center sm:text-left">
          <div className={`text-3xl sm:text-4xl font-extrabold ${COLORS[i % COLORS.length]}`}>
            {stat.value}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
