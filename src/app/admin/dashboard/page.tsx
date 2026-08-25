import { listItems, listContactMessages } from "@/lib/items";
import Link from "next/link";

export default async function DashboardOverviewPage() {
  const allItems = listItems({ includeAll: true });
  const published = allItems.filter((i) => i.status === "published");
  const messages = listContactMessages() as { status: string }[];
  const newMessages = messages.filter((m) => m.status === "new");

  const categoryCounts = {
    support: allItems.filter((i) => i.category === "support").length,
    course: allItems.filter((i) => i.category === "course").length,
    education: allItems.filter((i) => i.category === "education").length,
    event: allItems.filter((i) => i.category === "event").length,
  };

  const stats = [
    { label: "إجمالي العناصر", value: allItems.length, icon: "🗂️", color: "bg-[#7a1f2b]" },
    { label: "عناصر منشورة", value: published.length, icon: "✅", color: "bg-green-600" },
    { label: "الرسائل الجديدة", value: newMessages.length, icon: "✉️", color: "bg-[#b08d57]" },
    { label: "إجمالي الرسائل", value: messages.length, icon: "📥", color: "bg-slate-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#5c1620]">نظرة عامة</h1>
      <p className="mt-1 text-sm text-[#2a2420]/60">ملخص سريع عن نشاط مركز إيلاف</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color} text-xl text-white`}>
              {s.icon}
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#5c1620]">{s.value}</div>
            <div className="mt-1 text-sm text-[#2a2420]/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "جلسات الإرشاد النفسي", value: categoryCounts.support, href: "/admin/dashboard/items?category=support" },
          { label: "الدورات التدريبية", value: categoryCounts.course, href: "/admin/dashboard/items?category=course" },
          { label: "البرامج التعليمية", value: categoryCounts.education, href: "/admin/dashboard/items?category=education" },
          { label: "الملتقيات والفعاليات", value: categoryCounts.event, href: "/admin/dashboard/items?category=event" },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-5 shadow-sm transition hover:border-[#7a1f2b]/30 hover:shadow-md"
          >
            <div className="text-2xl font-extrabold text-[#7a1f2b]">{c.value}</div>
            <div className="mt-1 text-sm text-[#2a2420]/70">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/dashboard/items/new"
          className="rounded-full bg-[#7a1f2b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5c1620]"
        >
          + إضافة عنصر جديد
        </Link>
        <Link
          href="/admin/dashboard/messages"
          className="rounded-full border-2 border-[#7a1f2b]/20 bg-white px-6 py-3 text-sm font-bold text-[#7a1f2b] transition hover:border-[#7a1f2b]"
        >
          عرض الرسائل
        </Link>
      </div>
    </div>
  );
}
