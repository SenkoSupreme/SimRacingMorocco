import Image, { type StaticImageData } from "next/image";

export function CapabilityCard({
  index,
  label,
  title,
  icon,
  accent = "accent",
  image,
  children,
}: {
  index: string;
  label: string;
  title: string;
  icon: React.ReactNode;
  accent?: "accent" | "positive" | "foreground";
  image?: StaticImageData;
  children: React.ReactNode;
}) {
  const accentClass =
    accent === "positive" ? "text-positive" : accent === "foreground" ? "text-foreground" : "text-accent";
  const barClass =
    accent === "positive" ? "bg-positive" : accent === "foreground" ? "bg-foreground/50" : "bg-accent";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border p-6 transition-all duration-300 hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.7)]">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/75 group-hover:bg-background/65 transition-colors duration-300" />
        </>
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${barClass} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      <div className="relative flex items-center justify-between">
        <div className="text-xs font-mono text-accent tracking-wide">
          {index} // {label}
        </div>
        <div className={`${accentClass} opacity-80 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <h3 className="relative mt-3 font-display text-xl font-bold uppercase tracking-tight">{title}</h3>
      <p className="relative mt-2 text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}
