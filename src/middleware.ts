import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/locales";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/admin-api")) {
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|admin-api|admin|_next|_vercel|images|.*\\..*).*)"],
};
