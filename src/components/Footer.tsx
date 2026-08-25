import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface FooterProps {
  logoUrl: string;
  centerName: string;
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Footer({
  logoUrl,
  centerName,
  address,
  phone1,
  phone2,
  email,
  facebookUrl,
  instagramUrl,
}: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: tNav("home") },
    { href: "/about", label: tNav("about") },
    { href: "/support", label: tNav("support") },
    { href: "/courses", label: tNav("courses") },
    { href: "/education", label: tNav("education") },
    { href: "/events", label: tNav("events") },
    { href: "/contact", label: tNav("contact") },
  ];

  return (
    <footer className="mt-20 border-t border-gold/20 bg-maroon-dark text-cream-light">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-gold/40">
                <Image src={logoUrl} alt={centerName} fill className="object-cover" sizes="48px" />
              </div>
              <span className="text-lg font-bold text-white">{centerName}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-light/80">{t("about")}</p>
            {(facebookUrl || instagramUrl) && (
              <div className="mt-4 flex gap-3">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-gold/30">
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-gold/30">
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M12 2c2.7 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.07.06 1.42.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.55.55-1.11.9-1.77 1.15-.64.25-1.37.42-2.43.47-1.07.05-1.42.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.7 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.95.01 9.3 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1 0-2.33 1.17 1.17 0 0 1 0 2.33Z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-gold">{t("quickLinks")}</h4>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream-light/80 transition hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-gold">{t("contactInfo")}</h4>
            <ul className="space-y-3 text-sm text-cream-light/80">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone1}`} className="hover:text-gold" dir="ltr">{phone1}</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone2}`} className="hover:text-gold" dir="ltr">{phone2}</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-gold break-all">{email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-gold">{t("services")}</h4>
            <ul className="space-y-2.5 text-sm text-cream-light/80">
              <li><Link href="/support" className="hover:text-gold">{tNav("support")}</Link></li>
              <li><Link href="/courses" className="hover:text-gold">{tNav("courses")}</Link></li>
              <li><Link href="/education" className="hover:text-gold">{tNav("education")}</Link></li>
              <li><Link href="/events" className="hover:text-gold">{tNav("events")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-cream-light/60">
          © {year} {centerName} — {t("rights")}
        </div>
      </div>
    </footer>
  );
}
