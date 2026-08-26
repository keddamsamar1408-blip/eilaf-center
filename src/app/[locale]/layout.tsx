import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { locales, localeDirection, type Locale } from "@/i18n/locales";
import { getAllSettings } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getAllSettings();
  const nameKey = locale === "fr" ? "center_name_fr" : locale === "en" ? "center_name_en" : "center_name_ar";
  const taglineKey = locale === "fr" ? "tagline_fr" : locale === "en" ? "tagline_en" : "tagline_ar";
  return {
    title: settings[nameKey] || "Eilaf Center",
    description: settings[taglineKey] || "",
    icons: { icon: settings.logo_url || "/images/logo.jpg" },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  const settings = await getAllSettings();
  const dir = localeDirection[locale as Locale];
  const centerName =
    locale === "fr" ? settings.center_name_fr : locale === "en" ? settings.center_name_en : settings.center_name_ar;

  const address =
    locale === "fr" ? settings.address_fr : locale === "en" ? settings.address_en : settings.address_ar;

  return (
    <div dir={dir} className="antialiased">
      <NextIntlClientProvider>
        <Header logoUrl={settings.logo_url} centerName={centerName} />
        <main className="min-h-screen">{children}</main>
        <Footer
          logoUrl={settings.logo_url}
          centerName={centerName}
          address={address}
          phone1={settings.phone_1}
          phone2={settings.phone_2}
          email={settings.email}
          facebookUrl={settings.facebook_url}
          instagramUrl={settings.instagram_url}
        />
        <WhatsAppButton phone={settings.whatsapp_number} />
      </NextIntlClientProvider>
    </div>
  );
}


