import { getTranslations, getLocale } from "next-intl/server";
import { getAllSettings } from "@/lib/db";
import ContactForm from "@/components/ContactForm";
import type { Locale } from "@/i18n/locales";

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const settings = await getAllSettings();

  const address = locale === "fr" ? settings.address_fr : locale === "en" ? settings.address_en : settings.address_ar;
  const mapQuery = encodeURIComponent(address);
  const waHref = `https://wa.me/${settings.whatsapp_number}`;

  return (
    <div>
      <section className="bg-gradient-to-br from-cream via-cream-light to-white pattern-bg py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-maroon-dark sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-lg text-ink/60">{t("subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-maroon/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-maroon-dark">{t("formTitle")}</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-maroon-dark p-6 text-cream-light shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-white">{t("infoTitle")}</h2>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 rounded-xl bg-[#25D366]/15 p-4 transition hover:bg-[#25D366]/25"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
                  <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white">
                    <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.383.63 4.626 1.822 6.612L4 29l7.548-1.986a11.94 11.94 0 0 0 4.456.857h.004c6.627 0 12.004-5.377 12.004-12.004C28.012 8.377 22.635 3 16.004 3Zm7.03 17.03c-.294.827-1.462 1.513-2.404 1.712-.639.132-1.474.238-4.284-.917-3.598-1.478-5.916-5.135-6.098-5.373-.176-.238-1.462-1.945-1.462-3.71 0-1.765.926-2.633 1.253-2.995.328-.362.717-.453.956-.453.238 0 .478.002.686.013.22.011.516-.083.807.616.294.706 1 2.435 1.088 2.612.088.176.147.383.03.62-.117.239-.176.386-.353.593-.176.207-.372.462-.53.62-.176.176-.36.367-.155.72.206.353.914 1.51 1.964 2.446 1.35 1.204 2.489 1.577 2.842 1.754.353.176.559.147.765-.088.206-.235.883-1.03 1.118-1.383.235-.353.47-.294.794-.176.324.117 2.06.972 2.412 1.148.353.176.588.264.676.412.088.147.088.853-.206 1.68Z" />
                  </svg>
                </span>
                <span className="text-sm font-semibold">{t("whatsappCta")}</span>
              </a>

              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-gold">ًں“چ</span>
                  <span>{address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold">ًں“‍</span>
                  <a href={`tel:${settings.phone_1}`} dir="ltr">{settings.phone_1}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold">ًں“‍</span>
                  <a href={`tel:${settings.phone_2}`} dir="ltr">{settings.phone_2}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold">✉️</span>
                  <a href={`mailto:${settings.email}`} className="break-all">{settings.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="section-title text-center text-2xl font-extrabold text-maroon-dark">{t("mapTitle")}</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-maroon/10 shadow-sm">
            <iframe
              title="map"
              width="100%"
              height="400"
              loading="lazy"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

