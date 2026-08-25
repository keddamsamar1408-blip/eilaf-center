# مركز إيلاف — Eilaf Center Website

A real, production-ready website for **Eilaf Center for Training and Family Guidance**
(مركز إيلاف للتدريب والإرشاد الأسري), built with Next.js 16, a real SQLite database,
real JWT/bcrypt authentication, and a full admin dashboard.

This is **not a demo**. It has a real backend, a real database, and real content
management. Everything the center offers — psychological support sessions, training
courses, educational programs, and conferences/events — is stored in the database and
fully editable from the admin dashboard, with no code changes required.

---

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind CSS v4, custom brand theme (burgundy / gold / cream, matching
  the official Eilaf logo)
- **Database:** SQLite via `better-sqlite3` — a real embedded SQL database, stored at
  `data/eilaf.db`. No external DB server needed; easy to move to Postgres/MySQL later
  if the center scales up (see "Scaling the database" below).
- **Auth:** bcrypt password hashing + signed JWT session cookies (httpOnly, secure in
  production). No third-party auth provider — fully self-contained.
- **i18n:** `next-intl`, three languages — Arabic (default, RTL), French, English (LTR)
- **Fonts:** self-hosted `@fontsource` (Cairo for Arabic, Inter for French/English) —
  no runtime dependency on Google Fonts, so the site works even in restricted network
  environments and loads fonts instantly.

---

## Project structure

```
src/
  app/
    [locale]/            Public site (ar/fr/en) — home, about, support, courses,
                          education, events, contact
    admin/                Admin dashboard (login, overview, content, messages, settings)
    admin-api/            Protected REST API for the admin dashboard (auth required)
    api/contact/          Public contact form submission endpoint
  components/             Shared UI components (Header, Footer, ItemCard, forms, etc.)
  components/admin/       Admin-only UI components (sidebar, item form)
  lib/
    db.ts                 Database connection, schema migration, and seed data
    auth.ts               JWT signing/verification, session cookies, bcrypt helpers
    items.ts              Data access layer for content items & contact messages
  i18n/                   Locale config, next-intl navigation & request config
  messages/               ar.json / fr.json / en.json translation files
data/
  eilaf.db                SQLite database file (created automatically on first run)
public/images/
  logo.jpg                Official Eilaf Center logo (as provided)
  cover.jpg                Official Eilaf Center cover/introduction image (as provided)
  uploads/                Images uploaded via the admin dashboard land here
```

---

## Running locally

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000` (redirects to `/ar` by default).

On first run, the database is created automatically and seeded with:
- Default center settings (name, tagline, address, phone numbers, WhatsApp number,
  email — all taken from the official cover image you provided)
- One sample item in each category (support session, course, educational program,
  event) so the site isn't empty
- **One default admin account** (see below)

### Default admin login

```
URL:      http://localhost:3000/admin/login
Email:    admin@eilaf-center.com
Password: Eilaf@2026Admin
```

**Change this password immediately after first login** — go to
Dashboard -> إعدادات المركز (Settings) -> تغيير كلمة المرور (Change Password).

You can also set a different default admin on first run (before the database is
created) via environment variables — see `.env.example`.

---

## Environment variables

Copy `.env.example` to `.env.local` and adjust as needed:

```
JWT_SECRET=replace-this-with-a-long-random-string-in-production
ADMIN_EMAIL=admin@eilaf-center.com
ADMIN_PASSWORD=Eilaf@2026Admin
```

`JWT_SECRET` **must** be changed to a long random string in production — it signs the
admin session cookies. `ADMIN_EMAIL`/`ADMIN_PASSWORD` only take effect the very first
time the app runs (when the `admins` table is first created and seeded); after that,
change the password from the dashboard instead.

---

## Building for production

```bash
npm run build
npm run start
```

This has been tested and runs a real production build successfully (all pages compile,
all routes render, all API routes work).

### Deploying to a real domain

This app runs as a standard Next.js Node server, so it deploys anywhere that supports
Node.js 18+:

- **VPS (recommended for this use case):** clone the repo, run `npm install && npm run
  build`, then run `npm run start` behind a process manager (`pm2`, `systemd`) and a
  reverse proxy (Nginx/Caddy) for HTTPS and your domain.
- **Any Node hosting platform** (Railway, Render, Fly.io, DigitalOcean App Platform,
  etc.): point it at this repo, build command `npm run build`, start command `npm run
  start`.
- Make sure the `data/` and `public/images/uploads/` directories are on **persistent
  storage** (not ephemeral), since that's where the real database and uploaded images
  live. On most VPS/container platforms this means mounting a persistent volume for
  those two folders.
- Set `JWT_SECRET` to a strong random value in your production environment variables.
- Point your domain's DNS at the server and set up HTTPS (e.g. via Let's Encrypt/Caddy
  or your platform's built-in TLS).

### Scaling the database

SQLite (via `better-sqlite3`) is genuinely production-ready for a single-server site
like this one — it comfortably handles far more traffic than a center like this will
see. If the center ever needs a separate managed database server, the entire data
layer lives in three files (`src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/items.ts`), so
swapping the storage engine (e.g. to Postgres) is a contained, well-isolated change
that doesn't touch any page or component code.

---

## What the admin dashboard can manage

At `/admin/dashboard`, after logging in:

- **Overview** — quick stats: total items, published items, new messages, per-category
  counts
- **Content management** (`/admin/dashboard/items`) — full CRUD for:
  - Psychological support sessions
  - Training courses
  - Educational programs
  - Conferences & events

  For each item: title & description in Arabic/French/English, attendance mode
  (in-person / Zoom / Google Meet / hybrid), meeting link, physical location, start/end
  date & time, price, capacity, image, status (draft/published/archived), and a
  "featured" flag to highlight it on the homepage.
- **Contact messages** (`/admin/dashboard/messages`) — every submission from the public
  contact form, with status tracking (new/read/replied/archived) and quick
  email/WhatsApp reply links.
- **Center settings** (`/admin/dashboard/settings`) — center name & tagline (in all 3
  languages), logo & cover image upload, address (in all 3 languages), phone numbers,
  WhatsApp number, email, social media links, and admin password change.

All changes take effect immediately on the public site — no redeploy needed.

---

## Real WhatsApp integration

Every "Register" button on session/course/program/event cards, the floating WhatsApp
button on every page, and the WhatsApp call-to-action on the Contact page all link to
`https://wa.me/<whatsapp_number>` using the real number from the official cover image
(`+213 795 960 592` by default, editable in Settings). Messages are pre-filled with
context (e.g. which session the visitor is interested in) so the center's staff can
respond immediately.

---

## Notes on the visual identity

Both official images you provided are used as-is:
- `public/images/logo.jpg` — the Eilaf calligraphy logo, used in the header, footer,
  admin sidebar, and admin login screen
- `public/images/cover.jpg` — the official introduction/cover image, used as the
  homepage hero image and on the About page

The color theme (burgundy `#7a1f2b`, gold `#b08d57`, cream `#f7ede0`) was picked to
match this logo and cover image exactly.
