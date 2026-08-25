"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Item, ItemCategory, ItemMode, ItemStatus } from "@/lib/items";

interface FormState {
  category: ItemCategory;
  title_ar: string;
  title_fr: string;
  title_en: string;
  description_ar: string;
  description_fr: string;
  description_en: string;
  mode: ItemMode;
  meeting_link: string;
  location: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  price: string;
  capacity: string;
  image_url: string;
  status: ItemStatus;
  featured: boolean;
}

function itemToForm(item?: Item): FormState {
  return {
    category: item?.category ?? "support",
    title_ar: item?.title_ar ?? "",
    title_fr: item?.title_fr ?? "",
    title_en: item?.title_en ?? "",
    description_ar: item?.description_ar ?? "",
    description_fr: item?.description_fr ?? "",
    description_en: item?.description_en ?? "",
    mode: item?.mode ?? "in_person",
    meeting_link: item?.meeting_link ?? "",
    location: item?.location ?? "",
    start_date: item?.start_date ?? "",
    start_time: item?.start_time ?? "",
    end_date: item?.end_date ?? "",
    end_time: item?.end_time ?? "",
    price: item?.price ?? "",
    capacity: item?.capacity ? String(item.capacity) : "",
    image_url: item?.image_url ?? "",
    status: item?.status ?? "draft",
    featured: !!item?.featured,
  };
}

const inputClass =
  "w-full rounded-xl border border-[#7a1f2b]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/10";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#2a2420]/80";

export default function ItemForm({ item, itemId }: { item?: Item; itemId?: number }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(itemToForm(item));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/admin-api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) set("image_url", data.url);
      else setError("فشل رفع الصورة");
    } catch {
      setError("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      capacity: form.capacity ? Number(form.capacity) : undefined,
    };

    try {
      const url = itemId ? `/admin-api/items/${itemId}` : "/admin-api/items";
      const method = itemId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "invalid_input" ? "يرجى التحقق من الحقول المطلوبة" : "حدث خطأ أثناء الحفظ");
        setSaving(false);
        return;
      }
      router.push("/admin/dashboard/items");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء الحفظ");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}

      <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-[#5c1620]">معلومات أساسية</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>التصنيف</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value as ItemCategory)} className={inputClass}>
              <option value="support">جلسات الإرشاد النفسي</option>
              <option value="course">الدورات التدريبية</option>
              <option value="education">البرامج التعليمية</option>
              <option value="event">الملتقيات والفعاليات</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>الحالة</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as ItemStatus)} className={inputClass}>
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass}>العنوان (عربي) *</label>
            <input required value={form.title_ar} onChange={(e) => set("title_ar", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>العنوان (فرنسي)</label>
            <input value={form.title_fr} onChange={(e) => set("title_fr", e.target.value)} className={inputClass} dir="ltr" />
          </div>
          <div>
            <label className={labelClass}>العنوان (إنجليزي)</label>
            <input value={form.title_en} onChange={(e) => set("title_en", e.target.value)} className={inputClass} dir="ltr" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass}>الوصف (عربي)</label>
            <textarea rows={3} value={form.description_ar} onChange={(e) => set("description_ar", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>الوصف (فرنسي)</label>
            <textarea rows={3} value={form.description_fr} onChange={(e) => set("description_fr", e.target.value)} className={inputClass} dir="ltr" />
          </div>
          <div>
            <label className={labelClass}>الوصف (إنجليزي)</label>
            <textarea rows={3} value={form.description_en} onChange={(e) => set("description_en", e.target.value)} className={inputClass} dir="ltr" />
          </div>
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm font-medium text-[#2a2420]/80">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-[#7a1f2b]" />
          مميز (يظهر في الصفحة الرئيسية)
        </label>
      </section>

      <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-[#5c1620]">طريقة الحضور والموعد</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>طريقة الحضور</label>
            <select value={form.mode} onChange={(e) => set("mode", e.target.value as ItemMode)} className={inputClass}>
              <option value="in_person">حضوري في المركز</option>
              <option value="zoom">عن بعد عبر Zoom</option>
              <option value="google_meet">عن بعد عبر Google Meet</option>
              <option value="hybrid">حضوري أو عن بعد</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>رابط الاجتماع (Zoom / Meet)</label>
            <input value={form.meeting_link} onChange={(e) => set("meeting_link", e.target.value)} className={inputClass} dir="ltr" placeholder="https://zoom.us/..." />
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass}>المكان (إن وجد)</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>تاريخ البداية</label>
            <input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>وقت البداية</label>
            <input type="time" value={form.start_time} onChange={(e) => set("start_time", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>تاريخ النهاية</label>
            <input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>وقت النهاية</label>
            <input type="time" value={form.end_time} onChange={(e) => set("end_time", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>السعر</label>
            <input value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClass} placeholder="مجاني / 2000 دج ..." />
          </div>
          <div>
            <label className={labelClass}>عدد المقاعد</label>
            <input type="number" min={0} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-[#5c1620]">صورة العنصر</h2>
        <div className="flex flex-wrap items-center gap-4">
          {form.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image_url} alt="preview" className="h-24 w-24 rounded-xl object-cover" />
          )}
          <label className="cursor-pointer rounded-full border border-[#7a1f2b]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#7a1f2b] hover:border-[#7a1f2b]">
            {uploading ? "جاري الرفع..." : "رفع صورة"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#7a1f2b] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#5c1620] disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/items")}
          className="rounded-full border-2 border-[#7a1f2b]/20 bg-white px-8 py-3 text-sm font-bold text-[#7a1f2b] hover:border-[#7a1f2b]"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
