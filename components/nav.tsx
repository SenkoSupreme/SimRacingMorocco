"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/public/brand/srm-logo.jpg";
import { DISCORD_URL } from "@/lib/constants";

const links = [
  { href: "/overview", label: "Overview" },
  { href: "/standings", label: "Standings" },
  { href: "/events", label: "Events" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <Image
            src={logo}
            alt="SRM logo"
            width={32}
            height={32}
            className="rounded-sm"
            priority
          />
          <span className="font-display font-bold uppercase tracking-tight text-foreground">
            SRM <span className="text-accent">Portal</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-5 text-sm">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
          <Link
            href={DISCORD_URL}
            className="ml-2 rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-accent-foreground hover:brightness-110 transition-transform active:scale-95"
          >
            Join Discord
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden flex h-11 w-11 items-center justify-center rounded-md text-foreground"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-border px-4 pb-4 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={pathname === link.href}
              mobile
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            href={DISCORD_URL}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground text-center"
          >
            Join Discord
          </Link>
        </nav>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  mobile,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  mobile?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        (mobile ? "py-2.5 " : "") +
        (active
          ? "text-foreground font-medium"
          : "text-muted hover:text-foreground transition-colors")
      }
    >
      {children}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
