import { useLocale, useTranslations } from "next-intl";
import type { Item } from "@/lib/items";
import type { Locale } from "@/i18n/locales";
import Image from "next/image";

function pick(item: Item, field: "title" | "description", locale: Locale): string {
  const key = `${field}_${locale}` as keyof Item;
  return (item[key] as string) || (item[`${field}_ar` as keyof Item] as string) || "";
}

const modeIcons: Record<string, string> = {
  in_person: "📍",
  zoom: "💻",
  google_meet: "🎥",
  hybrid: "🔀",
};

export default function ItemCard({ item, whatsapp }: { item: Item; whatsapp: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  const title = pick(item, "title", locale);
  const desc = pick(item, "description", locale);
  const modeLabel = {
    in_person: t("modeInPerson"),
    zoom: t("modeZoom"),
    google_meet: t("modeGoogleMeet"),
    hybrid: t("modeHybrid"),
  }[item.mode];

  const waText = encodeURIComponent(`مرحبًا، أرغب في الاستفسار/التسجيل في: ${title}`);
  const waHref = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${waText}`;

  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-maroon/10 bg-white shadow-sm">
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-maroon to-maroon-light">
        {item.image_url ? (
          <Image src={item.image_url} alt={title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl opacity-80">{modeIcons[item.mode]}</span>
          </div>
        )}
        {!!item.featured && (
          <span className="absolute top-3 start-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white shadow">
            {t("featured")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-maroon-dark">{title}</h3>
        {desc && <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">{desc}</p>}

        <div className="mt-4 space-y-1.5 text-xs text-ink/60">
          <div className="flex items-center gap-1.5">
            <span>{modeIcons[item.mode]}</span>
            <span>{modeLabel}</span>
          </div>
          {item.start_date && (
            <div className="flex items-center gap-1.5">
              <span>🗓️</span>
              <span>
                {item.start_date} {item.start_time && `- ${item.start_time}`}
              </span>
            </div>
          )}
          {item.location && item.mode !== "zoom" && item.mode !== "google_meet" && (
            <div className="flex items-center gap-1.5">
              <span>📌</span>
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
          {item.price && (
            <div className="flex items-center gap-1.5">
              <span>💰</span>
              <span>{item.price}</span>
            </div>
          )}
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark"
        >
          {t("register")}
        </a>
      </div>
    </div>
  );
}
