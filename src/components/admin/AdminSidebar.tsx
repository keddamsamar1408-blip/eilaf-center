"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const links = [
  { href: "/admin/dashboard", label: "نظرة عامة", icon: "📊" },
  { href: "/admin/dashboard/items", label: "إدارة المحتوى", icon: "🗂️" },
  { href: "/admin/dashboard/messages", label: "رسائل التواصل", icon: "✉️" },
  { href: "/admin/dashboard/settings", label: "إعدادات المركز", icon: "⚙️" },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/admin-api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const NavLinks = (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map((l) => {
        const active = l.href === "/admin/dashboard" ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              active ? "bg-[#7a1f2b] text-white" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-[#5c1620] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/30">
            <Image src="/images/logo.jpg" alt="logo" fill className="object-cover" sizes="36px" />
          </div>
          <span className="text-sm font-bold text-white">لوحة إيلاف</span>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#5c1620] p-5 lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#b08d57]/50">
            <Image src="/images/logo.jpg" alt="logo" fill className="object-cover" sizes="44px" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">مركز إيلاف</div>
            <div className="text-xs text-white/60">لوحة التحكم</div>
          </div>
        </div>

        {NavLinks}

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="mb-3 px-1 text-xs text-white/60">مرحبًا، {adminName}</div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 flex w-72 flex-col bg-[#5c1620] p-5 pt-16">
            {NavLinks}
            <div className="mt-auto border-t border-white/10 pt-4">
              <div className="mb-3 px-1 text-xs text-white/60">مرحبًا، {adminName}</div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
              >
                🚪 تسجيل الخروج
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="h-14 lg:hidden" />
    </>
  );
}
