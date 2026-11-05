export function CapabilityCard({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="text-xs font-mono text-accent tracking-wide">
        {index} // {label}
      </div>
      <h3 className="mt-3 text-lg font-bold uppercase tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}
