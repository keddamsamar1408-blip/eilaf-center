import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "eilaf.db");

// Reuse a single connection across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __eilaf_db__: Database.Database | undefined;
}

function createConnection() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export const db = global.__eilaf_db__ ?? createConnection();
if (process.env.NODE_ENV !== "production") global.__eilaf_db__ = db;

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- generic content items: covers sessions, courses, programs, events
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL CHECK (category IN ('support','course','education','event')),
      title_ar TEXT NOT NULL,
      title_fr TEXT,
      title_en TEXT,
      description_ar TEXT,
      description_fr TEXT,
      description_en TEXT,
      mode TEXT NOT NULL DEFAULT 'in_person' CHECK (mode IN ('in_person','zoom','google_meet','hybrid')),
      meeting_link TEXT,
      location TEXT,
      start_date TEXT,
      start_time TEXT,
      end_date TEXT,
      end_time TEXT,
      price TEXT,
      capacity INTEGER,
      image_url TEXT,
      status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      item_id INTEGER,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
    CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
    CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);
  `);

  // Seed default settings if empty
  const defaultSettings: Record<string, string> = {
    center_name_ar: "مركز إيلاف للتدريب والإرشاد الأسري",
    center_name_fr: "Centre Eilaf de formation et d'accompagnement familial",
    center_name_en: "Eilaf Center for Training and Family Guidance",
    tagline_ar: "نبني الإنسان... لننهض بالأسرة... ونرتقي بالمجتمع",
    tagline_fr: "Construire l'humain... élever la famille... élever la société",
    tagline_en: "Building people... uplifting the family... elevating society",
    address_ar: "الطريق الوطني رقم 19، شارع الإخوة الثلاثة الجيلالي، بلدية بئر خادم، الجزائر العاصمة",
    address_fr: "Route Nationale N°19, Rue des Trois Frères Djelali, Commune de Bir Khadem, Alger",
    address_en: "National Road No. 19, Three Brothers Djelali Street, Bir Khadem Municipality, Algiers",
    phone_1: "+213795960592",
    phone_2: "+213676042201",
    whatsapp_number: "213795960592",
    email: "elaffamilycenter@gmail.com",
    facebook_url: "",
    instagram_url: "",
    logo_url: "/images/logo.jpg",
    cover_url: "/images/cover.jpg",
  };

  const existing = db.prepare("SELECT COUNT(*) as c FROM settings").get() as { c: number };
  if (existing.c === 0) {
    const insert = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
    const tx = db.transaction((entries: [string, string][]) => {
      for (const [k, v] of entries) insert.run(k, v);
    });
    tx(Object.entries(defaultSettings));
  }

  // Seed default admin if none exists
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM admins").get() as { c: number };
  if (adminCount.c === 0) {
    const defaultEmail = process.env.ADMIN_EMAIL || "admin@eilaf-center.com";
    const defaultPassword = process.env.ADMIN_PASSWORD || "Eilaf@2026Admin";
    const hash = bcrypt.hashSync(defaultPassword, 10);
    db.prepare(
      "INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)"
    ).run(defaultEmail, hash, "مدير المركز");
    console.log(`\n[Eilaf Center] Default admin created:\n  Email: ${defaultEmail}\n  Password: ${defaultPassword}\n  ⚠ Please change this after first login.\n`);
  }

  // Seed sample content items if empty (so the site is not empty on first run)
  const itemCount = db.prepare("SELECT COUNT(*) as c FROM items").get() as { c: number };
  if (itemCount.c === 0) {
    const insertItem = db.prepare(`
      INSERT INTO items (
        category, title_ar, title_fr, title_en, description_ar, description_fr, description_en,
        mode, meeting_link, location, start_date, start_time, price, capacity, status, featured
      ) VALUES (@category, @title_ar, @title_fr, @title_en, @description_ar, @description_fr, @description_en,
        @mode, @meeting_link, @location, @start_date, @start_time, @price, @capacity, @status, @featured)
    `);

    const samples = [
      {
        category: "support",
        title_ar: "جلسة إرشاد أسري فردية",
        title_fr: "Séance individuelle d'accompagnement familial",
        title_en: "Individual Family Guidance Session",
        description_ar: "جلسة دعم نفسي وإرشاد أسري فردية مع مختص مرافقة نفسية لمساعدتك على تجاوز الصعوبات الأسرية.",
        description_fr: "Séance individuelle de soutien psychologique et d'accompagnement familial avec un spécialiste.",
        description_en: "An individual psychological support and family guidance session with a specialist.",
        mode: "hybrid",
        meeting_link: "",
        location: "مقر المركز - بئر خادم، الجزائر",
        start_date: null,
        start_time: null,
        price: "حسب الاتفاق",
        capacity: 1,
        status: "published",
        featured: 1,
      },
      {
        category: "course",
        title_ar: "دورة تدريبية: مهارات التواصل الأسري",
        title_fr: "Formation : Compétences de communication familiale",
        title_en: "Training: Family Communication Skills",
        description_ar: "برنامج تدريبي عملي لتطوير مهارات التواصل الفعّال داخل الأسرة.",
        description_fr: "Programme pratique pour développer des compétences de communication efficace en famille.",
        description_en: "A practical program to develop effective communication skills within the family.",
        mode: "zoom",
        meeting_link: "",
        location: "",
        start_date: null,
        start_time: null,
        price: "",
        capacity: 20,
        status: "published",
        featured: 1,
      },
      {
        category: "education",
        title_ar: "برنامج تعليمي: مرافقة نفسية للمراهقين",
        title_fr: "Programme éducatif : Accompagnement psychologique des adolescents",
        title_en: "Educational Program: Psychological Support for Teens",
        description_ar: "برنامج تعليمي متكامل موجه للآباء لفهم ومرافقة أبنائهم المراهقين نفسيًا.",
        description_fr: "Un programme éducatif complet destiné aux parents pour accompagner leurs adolescents.",
        description_en: "A comprehensive educational program for parents to support their teenagers psychologically.",
        mode: "google_meet",
        meeting_link: "",
        location: "",
        start_date: null,
        start_time: null,
        price: "",
        capacity: 30,
        status: "published",
        featured: 0,
      },
      {
        category: "event",
        title_ar: "ملتقى: الأسرة الجزائرية وتحديات العصر",
        title_fr: "Colloque : La famille algérienne et les défis de l'époque",
        title_en: "Conference: The Algerian Family and Modern Challenges",
        description_ar: "ملتقى وطني يجمع مختصين في علم النفس الأسري لمناقشة تحديات الأسرة المعاصرة.",
        description_fr: "Un colloque national réunissant des spécialistes en psychologie familiale.",
        description_en: "A national conference bringing together family psychology specialists.",
        mode: "in_person",
        meeting_link: "",
        location: "مقر المركز - بئر خادم، الجزائر العاصمة",
        start_date: null,
        start_time: null,
        price: "مجاني",
        capacity: 100,
        status: "published",
        featured: 1,
      },
    ];

    const tx = db.transaction((rows: typeof samples) => {
      for (const row of rows) insertItem.run(row);
    });
    tx(samples);
  }
}

migrate();

export function getSetting(key: string): string | null {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

export function getAllSettings(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM settings").all() as {
    key: string;
    value: string;
  }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function setSetting(key: string, value: string) {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
}
