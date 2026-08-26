import { Pool } from "pg";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

declare global {
  // eslint-disable-next-line no-var
  var __eilaf_pg_pool__: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5,
  });
}

export const pool =
  global.__eilaf_pg_pool__ ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__eilaf_pg_pool__ = pool;
}

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Prevent concurrent Next.js workers from running migrations simultaneously.
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('eilaf-center-migration'))"
    );

  await client.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL CHECK (
        category IN ('support','course','education','event')
      ),
      title_ar TEXT NOT NULL,
      title_fr TEXT,
      title_en TEXT,
      description_ar TEXT,
      description_fr TEXT,
      description_en TEXT,
      mode TEXT NOT NULL DEFAULT 'in_person' CHECK (
        mode IN ('in_person','zoom','google_meet','hybrid')
      ),
      meeting_link TEXT,
      location TEXT,
      start_date TEXT,
      start_time TEXT,
      end_date TEXT,
      end_time TEXT,
      price TEXT,
      capacity INTEGER,
      image_url TEXT,
      status TEXT NOT NULL DEFAULT 'published' CHECK (
        status IN ('draft','published','archived')
      ),
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      item_id INTEGER,
      status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new','read','replied','archived')
      ),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_contact_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_items_category
      ON items(category);

    CREATE INDEX IF NOT EXISTS idx_items_status
      ON items(status);

    CREATE INDEX IF NOT EXISTS idx_messages_status
      ON contact_messages(status);
  `);

  const defaultSettings: Record<string, string> = {
    center_name_ar: "مركز إيلاف للتدريب والإرشاد الأسري",
    center_name_fr:
      "Centre Eilaf de formation et d'accompagnement familial",
    center_name_en:
      "Eilaf Center for Training and Family Guidance",

    tagline_ar:
      "نبني الإنسان... لننهض بالأسرة... ونرتقي بالمجتمع",
    tagline_fr:
      "Construire l'humain... élever la famille... élever la société",
    tagline_en:
      "Building people... uplifting the family... elevating society",

    address_ar:
      "الطريق الوطني رقم 19، شارع الإخوة الثلاثة الجيلالي، بلدية بئر خادم، الجزائر العاصمة",
    address_fr:
      "Route Nationale N°19, Rue des Trois Frères Djelali, Commune de Bir Khadem, Alger",
    address_en:
      "National Road No. 19, Three Brothers Djelali Street, Bir Khadem Municipality, Algiers",

    phone_1: "+213795960592",
    phone_2: "+213676042201",
    whatsapp_number: "213795960592",

    email: "elaffamilycenter@gmail.com",

    facebook_url: "",
    instagram_url: "",

    logo_url: "/images/logo.jpg",
    cover_url: "/images/cover.jpg",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await client.query(
      `
      INSERT INTO settings (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO NOTHING
      `,
      [key, value]
    );
  }

  const adminResult = await client.query(
    "SELECT COUNT(*)::int AS count FROM admins"
  );

  const adminCount = adminResult.rows[0].count;

  if (adminCount === 0) {
    const defaultEmail =
      process.env.ADMIN_EMAIL ||
      "admin@eilaf-center.com";

    const defaultPassword =
      process.env.ADMIN_PASSWORD ||
      "Eilaf@2026Admin";

    const hash = bcrypt.hashSync(defaultPassword, 10);

    await client.query(
      `
      INSERT INTO admins (
        email,
        password_hash,
        name
      )
      VALUES ($1, $2, $3)
      `,
      [
        defaultEmail,
        hash,
        "مدير المركز",
      ]
    );

    console.log(
      `[Eilaf Center] Default admin created: ${defaultEmail}`
    );
  }

  const itemResult = await client.query(
    "SELECT COUNT(*)::int AS count FROM items"
  );

  const itemCount = itemResult.rows[0].count;

  if (itemCount === 0) {
    const samples = [
      {
        category: "support",
        title_ar: "جلسة إرشاد أسري فردية",
        title_fr:
          "Séance individuelle d'accompagnement familial",
        title_en:
          "Individual Family Guidance Session",
        description_ar:
          "جلسة دعم نفسي وإرشاد أسري فردية مع مختص مرافقة نفسية لمساعدتك على تجاوز الصعوبات الأسرية.",
        description_fr:
          "Séance individuelle de soutien psychologique et d'accompagnement familial avec un spécialiste.",
        description_en:
          "An individual psychological support and family guidance session with a specialist.",
        mode: "hybrid",
        meeting_link: null,
        location: "مقر المركز - بئر خادم، الجزائر",
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        price: "حسب الاتفاق",
        capacity: 1,
        image_url: null,
        status: "published",
        featured: 1,
      },
      {
        category: "course",
        title_ar:
          "دورة تدريبية: مهارات التواصل الأسري",
        title_fr:
          "Formation : Compétences de communication familiale",
        title_en:
          "Training: Family Communication Skills",
        description_ar:
          "برنامج تدريبي عملي لتطوير مهارات التواصل الفعّال داخل الأسرة.",
        description_fr:
          "Programme pratique pour développer des compétences de communication efficace en famille.",
        description_en:
          "A practical program to develop effective communication skills within the family.",
        mode: "zoom",
        meeting_link: null,
        location: null,
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        price: null,
        capacity: 20,
        image_url: null,
        status: "published",
        featured: 1,
      },
      {
        category: "education",
        title_ar:
          "برنامج تعليمي: مرافقة نفسية للمراهقين",
        title_fr:
          "Programme éducatif : Accompagnement psychologique des adolescents",
        title_en:
          "Educational Program: Psychological Support for Teens",
        description_ar:
          "برنامج تعليمي متكامل موجه للآباء لفهم ومرافقة أبنائهم المراهقين نفسيًا.",
        description_fr:
          "Un programme éducatif complet destiné aux parents pour accompagner leurs adolescents.",
        description_en:
          "A comprehensive educational program for parents to support their teenagers psychologically.",
        mode: "google_meet",
        meeting_link: null,
        location: null,
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        price: null,
        capacity: 30,
        image_url: null,
        status: "published",
        featured: 0,
      },
      {
        category: "event",
        title_ar:
          "ملتقى: الأسرة الجزائرية وتحديات العصر",
        title_fr:
          "Colloque : La famille algérienne et les défis de l'époque",
        title_en:
          "Conference: The Algerian Family and Modern Challenges",
        description_ar:
          "ملتقى وطني يجمع مختصين في علم النفس الأسري لمناقشة تحديات الأسرة المعاصرة.",
        description_fr:
          "Un colloque national réunissant des spécialistes en psychologie familiale.",
        description_en:
          "A national conference bringing together family psychology specialists.",
        mode: "in_person",
        meeting_link: null,
        location:
          "مقر المركز - بئر خادم، الجزائر العاصمة",
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        price: "مجاني",
        capacity: 100,
        image_url: null,
        status: "published",
        featured: 1,
      },
    ];

    for (const item of samples) {
      await client.query(
        `
        INSERT INTO items (
          category,
          title_ar,
          title_fr,
          title_en,
          description_ar,
          description_fr,
          description_en,
          mode,
          meeting_link,
          location,
          start_date,
          start_time,
          end_date,
          end_time,
          price,
          capacity,
          image_url,
          status,
          featured
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19
        )
        `,
        [
          item.category,
          item.title_ar,
          item.title_fr,
          item.title_en,
          item.description_ar,
          item.description_fr,
          item.description_en,
          item.mode,
          item.meeting_link,
          item.location,
          item.start_date,
          item.start_time,
          item.end_date,
          item.end_time,
          item.price,
          item.capacity,
          item.image_url,
          item.status,
          item.featured,
        ]
      );
    }
  }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

let migrationPromise: Promise<void> | undefined;

export function ensureDatabase() {
  migrationPromise ??= migrate();
  return migrationPromise;
}

export async function getSetting(
  key: string
): Promise<string | null> {
  await ensureDatabase();

  const result = await pool.query(
    "SELECT value FROM settings WHERE key = $1",
    [key]
  );

  return result.rows[0]?.value ?? null;
}

export async function getAllSettings(): Promise<
  Record<string, string>
> {
  await ensureDatabase();

  const result = await pool.query(
    "SELECT key, value FROM settings"
  );

  return Object.fromEntries(
    result.rows.map((row) => [
      row.key,
      row.value,
    ])
  );
}

export async function setSetting(
  key: string,
  value: string
) {
  await ensureDatabase();

  await pool.query(
    `
    INSERT INTO settings (key, value)
    VALUES ($1, $2)
    ON CONFLICT (key)
    DO UPDATE SET value = EXCLUDED.value
    `,
    [key, value]
  );
}



