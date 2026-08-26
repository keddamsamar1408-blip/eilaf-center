import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllSettings } from "@/lib/db";
import { listItems } from "@/lib/items";
import ItemCard from "@/components/ItemCard";
import Image from "next/image";
import type { Locale } from "@/i18n/locales";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as Locale;

  const settings = await getAllSettings();
  const allPublished = await listItems({});
  const featured = allPublished.filter((i) => i.featured).slice(0, 6);

  const tagline =
    locale === "fr"
      ? settings.tagline_fr
      : locale === "en"
        ? settings.tagline_en
        : settings.tagline_ar;

  const centerName =
    locale === "fr"
      ? settings.center_name_fr
      : locale === "en"
        ? settings.center_name_en
        : settings.center_name_ar;

  const services = [
    { icon: "ًں¤‌", title: t("service1Title"), desc: t("service1Desc") },
    { icon: "ًںژ“", title: t("service2Title"), desc: t("service2Desc") },
    { icon: "ًں“ڑ", title: t("service3Title"), desc: t("service3Desc") },
    { icon: "ًں§ ", title: t("service4Title"), desc: t("service4Desc") },
    { icon: "ًںŒ±", title: t("service5Title"), desc: t("service5Desc") },
  ];

  const stats = [
    { value: "+500", label: t("statsClients") },
    { value: "+40", label: t("statsCourses") },
    { value: "+15", label: t("statsEvents") },
    { value: "+10", label: t("statsExperts") },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-light to-white pattern-bg">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full bg-gold/20 px-4 py-1.5 text-sm font-semibold text-maroon-dark">
              {t("heroSubtitle")}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-maroon-dark sm:text-4xl lg:text-5xl">
              {centerName || t("heroTitle")}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              {tagline || t("heroTagline")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-maroon px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-maroon/20 transition hover:bg-maroon-dark"
              >
                {t("heroCta")}
              </Link>

              <Link
                href="/about"
                className="rounded-full border-2 border-maroon/20 bg-white px-7 py-3.5 text-sm font-bold text-maroon transition hover:border-maroon"
              >
                {t("heroCta2")}
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl ring-8 ring-white sm:aspect-[4/3]">
              <Image
                src={settings.cover_url}
                alt={centerName}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute -bottom-6 -start-6 hidden h-28 w-28 items-center justify-center rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 sm:flex">
              <Image
                src={settings.logo_url}
                alt="logo"
                width={90}
                height={90}
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-maroon/10 bg-maroon-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gold sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-cream-light/80">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="section-title inline-block text-2xl font-extrabold text-maroon-dark sm:text-3xl">
            {t("servicesTitle")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-ink/60">
            {t("servicesSubtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="card-hover rounded-2xl border border-maroon/10 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream text-3xl">
                {s.icon}
              </div>

              <h3 className="mt-4 font-bold text-maroon-dark">
                {s.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title inline-block text-2xl font-extrabold text-maroon-dark sm:text-3xl">
              {t("modesTitle")}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-ink/60">
              {t("modesSubtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: "ًںڈ¢",
                title: t("modeInPersonTitle"),
                desc: t("modeInPersonDesc"),
              },
              {
                icon: "ًں’»",
                title: t("modeZoomTitle"),
                desc: t("modeZoomDesc"),
              },
              {
                icon: "ًںژ¥",
                title: t("modeMeetTitle"),
                desc: t("modeMeetDesc"),
              },
            ].map((m) => (
              <div
                key={m.title}
                className="card-hover rounded-2xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-maroon-light text-3xl shadow-lg">
                  <span className="text-white">{m.icon}</span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-maroon-dark">
                  {m.title}
                </h3>

                <p className="mt-2 text-sm text-ink/60">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="section-title text-2xl font-extrabold text-maroon-dark sm:text-3xl">
              {t("featuredTitle")}
            </h2>

            <p className="mt-3 text-ink/60">
              {t("featuredSubtitle")}
            </p>
          </div>
        </div>

        {featured.length === 0 && allPublished.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-cream p-10 text-center text-ink/50">
            {tCommon("noItems")}
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length
              ? featured
              : allPublished.slice(0, 6)
            ).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                whatsapp={settings.whatsapp_number}
              />
            ))}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-maroon to-maroon-dark py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {t("ctaTitle")}
          </h2>

          <p className="mt-4 text-cream-light/90">
            {t("ctaSubtitle")}
          </p>

          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-maroon-dark shadow-lg transition hover:bg-gold-light"
          >
            {tCommon("whatsapp")}
          </a>
        </div>
      </section>
    </div>
  );
}