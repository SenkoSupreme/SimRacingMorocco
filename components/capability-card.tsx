export function CapabilityCard({
  index,
  label,
  title,
  icon,
  accent = "accent",
  children,
}: {
  index: string;
  label: string;
  title: string;
  icon: React.ReactNode;
  accent?: "accent" | "positive" | "foreground";
  children: React.ReactNode;
}) {
  const accentClass =
    accent === "positive" ? "text-positive" : accent === "foreground" ? "text-foreground" : "text-accent";
  const barClass =
    accent === "positive" ? "bg-positive" : accent === "foreground" ? "bg-foreground/50" : "bg-accent";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.7)]">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${barClass} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-accent tracking-wide">
          {index} // {label}
        </div>
        <div className={`${accentClass} opacity-80 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}
