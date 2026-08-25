"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "جديدة", color: "bg-blue-100 text-blue-700" },
  read: { label: "مقروءة", color: "bg-slate-100 text-slate-700" },
  replied: { label: "تم الرد", color: "bg-green-100 text-green-700" },
  archived: { label: "مؤرشفة", color: "bg-amber-100 text-amber-700" },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin-api/messages");
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: Message["status"]) {
    await fetch(`/admin-api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  async function handleDelete(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    await fetch(`/admin-api/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function toggleExpand(id: number, status: Message["status"]) {
    setExpandedId((prev) => (prev === id ? null : id));
    if (status === "new") updateStatus(id, "read");
  }

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#5c1620]">رسائل التواصل</h1>
      <p className="mt-1 text-sm text-[#2a2420]/60">الرسائل الواردة من نموذج اتصل بنا</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "new", "read", "replied", "archived"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === s ? "bg-[#7a1f2b] text-white" : "bg-white text-[#2a2420]/70 border border-[#7a1f2b]/15"
            }`}
          >
            {s === "all" ? "الكل" : statusLabels[s].label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#2a2420]/50 shadow-sm">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#2a2420]/50 shadow-sm">لا توجد رسائل</div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-[#7a1f2b]/10 bg-white shadow-sm">
              <button
                onClick={() => toggleExpand(m.id, m.status)}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-start"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2a2420]">{m.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusLabels[m.status].color}`}>
                      {statusLabels[m.status].label}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[#2a2420]/60">{m.subject || m.message.slice(0, 60)}</div>
                </div>
                <div className="text-xs text-[#2a2420]/40">{m.created_at}</div>
              </button>

              {expandedId === m.id && (
                <div className="border-t border-[#7a1f2b]/10 bg-[#fbf5ec] px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#2a2420]/80">{m.message}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#2a2420]/70">
                    {m.email && <a href={`mailto:${m.email}`} className="hover:text-[#7a1f2b]">✉️ {m.email}</a>}
                    {m.phone && (
                      <a href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#7a1f2b]">
                        📱 {m.phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <select
                      value={m.status}
                      onChange={(e) => updateStatus(m.id, e.target.value as Message["status"])}
                      className="rounded-lg border border-[#7a1f2b]/15 bg-white px-3 py-1.5 text-xs"
                    >
                      <option value="new">جديدة</option>
                      <option value="read">مقروءة</option>
                      <option value="replied">تم الرد</option>
                      <option value="archived">مؤرشفة</option>
                    </select>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
