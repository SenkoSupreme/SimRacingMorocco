import Image, { type StaticImageData } from "next/image";

export function PageBanner({
  image,
  title,
  subtitle,
}: {
  image: StaticImageData;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="pitwall-grid relative h-44 sm:h-52 overflow-hidden border-b border-border">
      <Image src={image} alt="" fill priority className="object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-6 pb-6 max-w-6xl mx-auto w-full">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">{title}</h1>
        <p className="text-sm text-muted mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
