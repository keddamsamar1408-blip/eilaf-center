import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eilaf-center.vercel.app";

  const locales = ["ar", "fr", "en"];

  const pages = [
    "",
    "/about",
    "/contact",
    "/courses",
    "/education",
    "/events",
    "/support",
  ];

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
    }))
  );
}
