import { getTranslations, getLocale } from "next-intl/server";
import { getAllSettings } from "@/lib/db";
import Image from "next/image";
import type { Locale } from "@/i18n/locales";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as Locale;
  const settings = await getAllSettings();

  const address = locale === "fr" ? settings.address_fr : locale === "en" ? settings.address_en : settings.address_ar;

  const values = [t("value1"), t("value2"), t("value3"), t("value4")];
  const services = [t("service1"), t("service2"), t("service3"), t("service4"), t("service5")];

  const mapQuery = encodeURIComponent(address);

  return (
    <div>
      <section className="bg-gradient-to-br from-cream via-cream-light to-white pattern-bg py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-maroon-dark sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-lg text-ink/60">{t("subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-2xl font-extrabold text-maroon-dark">{t("introTitle")}</h2>
            <p className="mt-5 text-base leading-loose text-ink/70">{t("introText")}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image src={settings.cover_url} alt={t("title")} fill className="object-cover" />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card-hover rounded-2xl border border-maroon/10 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-2xl">ًںژ¯</div>
            <h3 className="mt-5 text-xl font-bold text-maroon-dark">{t("missionTitle")}</h3>
            <p className="mt-3 leading-relaxed text-ink/70">{t("missionText")}</p>
          </div>
          <div className="card-hover rounded-2xl border border-maroon/10 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-2xl">ًں”­</div>
            <h3 className="mt-5 text-xl font-bold text-maroon-dark">{t("visionTitle")}</h3>
            <p className="mt-3 leading-relaxed text-ink/70">{t("visionText")}</p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="section-title text-center text-2xl font-extrabold text-maroon-dark">{t("valuesTitle")}</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="rounded-2xl bg-cream p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-ink/80">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="section-title text-center text-2xl font-extrabold text-maroon-dark">{t("servicesTitle")}</h2>
          <div className="mt-10 space-y-3">
            {services.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-maroon/10 bg-white p-5 shadow-sm">
                <span className="mt-0.5 text-gold">✦</span>
                <p className="text-ink/75">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="section-title text-center text-2xl font-extrabold text-maroon-dark">{t("locationTitle")}</h2>
          <p className="mt-4 text-center text-ink/70">{address}</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-maroon/10 shadow-sm">
            <iframe
              title="map"
              width="100%"
              height="380"
              loading="lazy"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

