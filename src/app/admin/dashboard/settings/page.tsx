"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Settings = Record<string, string>;

const inputClass =
  "w-full rounded-xl border border-[#7a1f2b]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/10";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#2a2420]/80";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [pwError, setPwError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin-api/settings");
    const data = await res.json();
    setSettings(data.settings || {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function set(key: string, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/admin-api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, key: "logo_url" | "cover_url") {
    const file = e.target.files?.[0];
    if (!file) return;
    const setUploading = key === "logo_url" ? setUploadingLogo : setUploadingCover;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/admin-api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) set(key, data.url);
    } finally {
      setUploading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus("saving");
    setPwError("");
    const res = await fetch("/admin-api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pwForm),
    });
    if (res.ok) {
      setPwStatus("success");
      setPwForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwStatus("idle"), 3000);
    } else {
      setPwStatus("error");
      setPwError("كلمة المرور الحالية غير صحيحة أو الكلمة الجديدة قصيرة جدًا");
    }
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#2a2420]/50 shadow-sm">جاري التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#5c1620]">إعدادات المركز</h1>
      <p className="mt-1 text-sm text-[#2a2420]/60">إدارة معلومات المركز، الصور، وبيانات التواصل</p>

      <form onSubmit={handleSave} className="mt-6 space-y-8">
        <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[#5c1620]">اسم المركز والشعار</h2>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className={labelClass}>اسم المركز (عربي)</label>
              <input value={settings.center_name_ar || ""} onChange={(e) => set("center_name_ar", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>اسم المركز (فرنسي)</label>
              <input value={settings.center_name_fr || ""} onChange={(e) => set("center_name_fr", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>اسم المركز (إنجليزي)</label>
              <input value={settings.center_name_en || ""} onChange={(e) => set("center_name_en", e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5">
            <div>
              <label className={labelClass}>الشعار (عربي)</label>
              <input value={settings.tagline_ar || ""} onChange={(e) => set("tagline_ar", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>الشعار (فرنسي)</label>
              <input value={settings.tagline_fr || ""} onChange={(e) => set("tagline_fr", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>الشعار (إنجليزي)</label>
              <input value={settings.tagline_en || ""} onChange={(e) => set("tagline_en", e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[#5c1620]">صور المركز</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>الشعار (Logo)</label>
              <div className="flex items-center gap-4">
                {settings.logo_url && (
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl ring-1 ring-[#7a1f2b]/10">
                    <Image src={settings.logo_url} alt="logo" fill className="object-cover" sizes="80px" />
                  </div>
                )}
                <label className="cursor-pointer rounded-full border border-[#7a1f2b]/20 bg-white px-4 py-2 text-xs font-medium text-[#7a1f2b] hover:border-[#7a1f2b]">
                  {uploadingLogo ? "جاري الرفع..." : "تغيير الشعار"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingLogo} onChange={(e) => handleImageUpload(e, "logo_url")} />
                </label>
              </div>
            </div>
            <div>
              <label className={labelClass}>صورة الغلاف</label>
              <div className="flex items-center gap-4">
                {settings.cover_url && (
                  <div className="relative h-20 w-32 overflow-hidden rounded-xl ring-1 ring-[#7a1f2b]/10">
                    <Image src={settings.cover_url} alt="cover" fill className="object-cover" sizes="128px" />
                  </div>
                )}
                <label className="cursor-pointer rounded-full border border-[#7a1f2b]/20 bg-white px-4 py-2 text-xs font-medium text-[#7a1f2b] hover:border-[#7a1f2b]">
                  {uploadingCover ? "جاري الرفع..." : "تغيير الغلاف"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingCover} onChange={(e) => handleImageUpload(e, "cover_url")} />
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[#5c1620]">العنوان</h2>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className={labelClass}>العنوان (عربي)</label>
              <textarea rows={2} value={settings.address_ar || ""} onChange={(e) => set("address_ar", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>العنوان (فرنسي)</label>
              <textarea rows={2} value={settings.address_fr || ""} onChange={(e) => set("address_fr", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>العنوان (إنجليزي)</label>
              <textarea rows={2} value={settings.address_en || ""} onChange={(e) => set("address_en", e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[#5c1620]">بيانات التواصل</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>الهاتف 1</label>
              <input value={settings.phone_1 || ""} onChange={(e) => set("phone_1", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>الهاتف 2</label>
              <input value={settings.phone_2 || ""} onChange={(e) => set("phone_2", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>رقم واتساب (بدون + أو رموز، مثال: 213795960592)</label>
              <input value={settings.whatsapp_number || ""} onChange={(e) => set("whatsapp_number", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>البريد الإلكتروني</label>
              <input value={settings.email || ""} onChange={(e) => set("email", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>رابط فيسبوك</label>
              <input value={settings.facebook_url || ""} onChange={(e) => set("facebook_url", e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>رابط انستغرام</label>
              <input value={settings.instagram_url || ""} onChange={(e) => set("instagram_url", e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#7a1f2b] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#5c1620] disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
          {saved && <span className="text-sm font-medium text-green-600">✓ تم حفظ الإعدادات بنجاح</span>}
        </div>
      </form>

      <section className="mt-10 rounded-2xl border border-[#7a1f2b]/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-[#5c1620]">تغيير كلمة المرور</h2>
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div>
            <label className={labelClass}>كلمة المرور الحالية</label>
            <input
              type="password"
              required
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              className={inputClass}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClass}>كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              minLength={6}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              className={inputClass}
              dir="ltr"
            />
          </div>
          {pwStatus === "error" && <p className="text-sm text-red-600">{pwError}</p>}
          {pwStatus === "success" && <p className="text-sm text-green-600">✓ تم تغيير كلمة المرور بنجاح</p>}
          <button
            type="submit"
            disabled={pwStatus === "saving"}
            className="rounded-full border-2 border-[#7a1f2b]/20 bg-white px-6 py-2.5 text-sm font-bold text-[#7a1f2b] hover:border-[#7a1f2b] disabled:opacity-60"
          >
            {pwStatus === "saving" ? "جاري الحفظ..." : "تغيير كلمة المرور"}
          </button>
        </form>
      </section>
    </div>
  );
}
