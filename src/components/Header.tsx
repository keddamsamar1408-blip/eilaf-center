"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import LocaleSwitcher from "./LocaleSwitcher";
import Image from "next/image";

export default function Header({ logoUrl, centerName }: { logoUrl: string; centerName: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/support", label: t("support") },
    { href: "/courses", label: t("courses") },
    { href: "/education", label: t("education") },
    { href: "/events", label: t("events") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-maroon/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-gold/40">
            <Image src={logoUrl} alt={centerName} fill className="object-cover" sizes="48px" />
          </div>
          <span className="hidden text-lg font-bold text-maroon sm:block">{centerName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                isActive(l.href)
                  ? "bg-maroon text-white"
                  : "text-ink/80 hover:bg-cream hover:text-maroon"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button
            className="rounded-lg p-2 text-maroon lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-maroon/10 bg-white px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(l.href) ? "bg-maroon text-white" : "text-ink/80 hover:bg-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
