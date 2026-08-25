"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, localeLabels, type Locale } from "@/i18n/locales";
import { useState, useRef, useEffect } from "react";

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function switchTo(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || "/");
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-maroon/20 bg-white/80 px-3 py-1.5 text-sm font-medium text-maroon transition hover:bg-maroon hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" />
        </svg>
        {localeLabels[locale]}
      </button>
      {open && (
        <div className="absolute end-0 z-50 mt-2 w-32 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-xl">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`block w-full px-4 py-2 text-start text-sm hover:bg-cream ${
                l === locale ? "font-bold text-maroon" : "text-ink"
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
