"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink/80">{t("nameLabel")}</label>
          <input
            required
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            className="w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink/80">{t("phoneLabel")}</label>
          <input
            name="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            className="w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/10"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink/80">{t("emailLabel")}</label>
        <input
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/10"
          dir="ltr"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink/80">{t("subjectLabel")}</label>
        <input
          name="subject"
          type="text"
          placeholder={t("subjectPlaceholder")}
          className="w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/10"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink/80">{t("messageLabel")}</label>
        <textarea
          required
          name="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          className="w-full resize-none rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/10"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-maroon/20 transition hover:bg-maroon-dark disabled:opacity-60"
      >
        {status === "loading" ? "..." : t("submitBtn")}
      </button>

      {status === "success" && (
        <p className="rounded-xl bg-green-50 p-4 text-center text-sm font-medium text-green-700">
          {t("submitSuccess")}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl bg-red-50 p-4 text-center text-sm font-medium text-red-700">{t("submitError")}</p>
      )}
    </form>
  );
}
