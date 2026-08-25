"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Item, ItemCategory } from "@/lib/items";

const categoryLabels: Record<ItemCategory, string> = {
  support: "جلسات الإرشاد النفسي",
  course: "الدورات التدريبية",
  education: "البرامج التعليمية",
  event: "الملتقيات والفعاليات",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "مسودة", color: "bg-slate-100 text-slate-700" },
  published: { label: "منشور", color: "bg-green-100 text-green-700" },
  archived: { label: "مؤرشف", color: "bg-amber-100 text-amber-700" },
};

function ItemsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = (searchParams.get("category") as ItemCategory | null) ?? "all";

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ItemCategory | "all">(initialCategory || "all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin-api/items");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    setDeletingId(id);
    await fetch(`/admin-api/items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeletingId(null);
  }

  function changeCategory(cat: ItemCategory | "all") {
    setCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    router.replace(`/admin/dashboard/items?${params.toString()}`);
  }

  const filtered = category === "all" ? items : items.filter((i) => i.category === category);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#5c1620]">إدارة المحتوى</h1>
          <p className="mt-1 text-sm text-[#2a2420]/60">إدارة الجلسات والدورات والبرامج والفعاليات</p>
        </div>
        <Link
          href="/admin/dashboard/items/new"
          className="rounded-full bg-[#7a1f2b] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5c1620]"
        >
          + إضافة جديد
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "support", "course", "education", "event"] as const).map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === c ? "bg-[#7a1f2b] text-white" : "bg-white text-[#2a2420]/70 border border-[#7a1f2b]/15"
            }`}
          >
            {c === "all" ? "الكل" : categoryLabels[c]}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#7a1f2b]/10 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-[#2a2420]/50">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#2a2420]/50">لا توجد عناصر</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#7a1f2b]/10 bg-[#fbf5ec] text-start">
                  <th className="px-4 py-3 text-start font-semibold text-[#2a2420]/70">العنوان</th>
                  <th className="px-4 py-3 text-start font-semibold text-[#2a2420]/70">التصنيف</th>
                  <th className="px-4 py-3 text-start font-semibold text-[#2a2420]/70">الحالة</th>
                  <th className="px-4 py-3 text-start font-semibold text-[#2a2420]/70">التاريخ</th>
                  <th className="px-4 py-3 text-start font-semibold text-[#2a2420]/70">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#7a1f2b]/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-[#2a2420]">
                      {item.title_ar}
                      {!!item.featured && <span className="ms-2 rounded-full bg-[#b08d57]/20 px-2 py-0.5 text-xs text-[#7a1f2b]">مميز</span>}
                    </td>
                    <td className="px-4 py-3 text-[#2a2420]/70">{categoryLabels[item.category]}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusLabels[item.status].color}`}>
                        {statusLabels[item.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#2a2420]/60">{item.start_date || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/dashboard/items/${item.id}`}
                          className="rounded-lg bg-[#7a1f2b]/10 px-3 py-1.5 text-xs font-medium text-[#7a1f2b] hover:bg-[#7a1f2b]/20"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[#2a2420]/50">جاري التحميل...</div>}>
      <ItemsPageInner />
    </Suspense>
  );
}
