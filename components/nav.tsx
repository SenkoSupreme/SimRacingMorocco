"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/standings", label: "Standings" },
  { href: "/events", label: "Events" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-8">
        <Link href="/" className="font-bold tracking-tight text-foreground">
          SRM <span className="text-accent">Portal</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-foreground font-medium"
                    : "text-muted hover:text-foreground transition-colors"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
