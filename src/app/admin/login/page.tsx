"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin-api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7ede0] via-[#fbf5ec] to-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#7a1f2b]/10 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-[#b08d57]/40">
            <Image src="/images/logo.jpg" alt="Eilaf" fill className="object-cover" sizes="64px" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-[#5c1620]">تسجيل دخول لوحة التحكم</h1>
          <p className="mt-1 text-sm text-[#2a2420]/60">مركز إيلاف - لوحة الإدارة</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#2a2420]/80">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-[#7a1f2b]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#2a2420]/80">كلمة المرور</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-[#7a1f2b]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/10"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#7a1f2b] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5c1620] disabled:opacity-60"
          >
            {loading ? "..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
