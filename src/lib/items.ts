import { pool, ensureDatabase } from "./db";

export type ItemCategory = "support" | "course" | "education" | "event";
export type ItemMode = "in_person" | "zoom" | "google_meet" | "hybrid";
export type ItemStatus = "draft" | "published" | "archived";

export interface Item {
  id: number;
  category: ItemCategory;
  title_ar: string;
  title_fr: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  mode: ItemMode;
  meeting_link: string | null;
  location: string | null;
  start_date: string | null;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  price: string | null;
  capacity: number | null;
  image_url: string | null;
  status: ItemStatus;
  featured: number;
  created_at: string;
  updated_at: string;
}

export async function listItems(
  opts: {
    category?: ItemCategory;
    status?: ItemStatus;
    includeAll?: boolean;
  } = {}
): Promise<Item[]> {
  await ensureDatabase();

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (opts.category) {
    values.push(opts.category);
    conditions.push(`category = $${values.length}`);
  }

  if (!opts.includeAll) {
    conditions.push(`status = 'published'`);
  } else if (opts.status) {
    values.push(opts.status);
    conditions.push(`status = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `
    SELECT *
    FROM items
    ${where}
    ORDER BY featured DESC,
      COALESCE(start_date, created_at::text) DESC,
      id DESC
    `,
    values
  );

  return result.rows as Item[];
}

export async function getItem(
  id: number
): Promise<Item | undefined> {
  await ensureDatabase();

  const result = await pool.query(
    "SELECT * FROM items WHERE id = $1 LIMIT 1",
    [id]
  );

  return result.rows[0] as Item | undefined;
}

export interface ItemInput {
  category: ItemCategory;
  title_ar: string;
  title_fr?: string;
  title_en?: string;
  description_ar?: string;
  description_fr?: string;
  description_en?: string;
  mode: ItemMode;
  meeting_link?: string;
  location?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  price?: string;
  capacity?: number;
  image_url?: string;
  status: ItemStatus;
  featured?: boolean;
}

export async function createItem(
  input: ItemInput
): Promise<number> {
  await ensureDatabase();

  const result = await pool.query(
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
      featured,
      updated_at
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,NOW()
    )
    RETURNING id
    `,
    [
      input.category,
      input.title_ar,
      input.title_fr ?? null,
      input.title_en ?? null,
      input.description_ar ?? null,
      input.description_fr ?? null,
      input.description_en ?? null,
      input.mode,
      input.meeting_link ?? null,
      input.location ?? null,
      input.start_date ?? null,
      input.start_time ?? null,
      input.end_date ?? null,
      input.end_time ?? null,
      input.price ?? null,
      input.capacity ?? null,
      input.image_url ?? null,
      input.status,
      input.featured ? 1 : 0,
    ]
  );

  return Number(result.rows[0].id);
}

export async function updateItem(
  id: number,
  input: ItemInput
): Promise<void> {
  await ensureDatabase();

  await pool.query(
    `
    UPDATE items SET
      category = $1,
      title_ar = $2,
      title_fr = $3,
      title_en = $4,
      description_ar = $5,
      description_fr = $6,
      description_en = $7,
      mode = $8,
      meeting_link = $9,
      location = $10,
      start_date = $11,
      start_time = $12,
      end_date = $13,
      end_time = $14,
      price = $15,
      capacity = $16,
      image_url = $17,
      status = $18,
      featured = $19,
      updated_at = NOW()
    WHERE id = $20
    `,
    [
      input.category,
      input.title_ar,
      input.title_fr ?? null,
      input.title_en ?? null,
      input.description_ar ?? null,
      input.description_fr ?? null,
      input.description_en ?? null,
      input.mode,
      input.meeting_link ?? null,
      input.location ?? null,
      input.start_date ?? null,
      input.start_time ?? null,
      input.end_date ?? null,
      input.end_time ?? null,
      input.price ?? null,
      input.capacity ?? null,
      input.image_url ?? null,
      input.status,
      input.featured ? 1 : 0,
      id,
    ]
  );
}

export async function deleteItem(id: number): Promise<void> {
  await ensureDatabase();

  await pool.query(
    "DELETE FROM items WHERE id = $1",
    [id]
  );
}

export interface ContactMessageInput {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  item_id?: number;
}

export async function createContactMessage(
  input: ContactMessageInput
): Promise<number> {
  await ensureDatabase();

  const result = await pool.query(
    `
    INSERT INTO contact_messages (
      name,
      email,
      phone,
      subject,
      message,
      item_id
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id
    `,
    [
      input.name,
      input.email ?? null,
      input.phone ?? null,
      input.subject ?? null,
      input.message,
      input.item_id ?? null,
    ]
  );

  return Number(result.rows[0].id);
}

export async function listContactMessages() {
  await ensureDatabase();

  const result = await pool.query(
    `
    SELECT *
    FROM contact_messages
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function updateMessageStatus(
  id: number,
  status: string
): Promise<void> {
  await ensureDatabase();

  await pool.query(
    `
    UPDATE contact_messages
    SET status = $1
    WHERE id = $2
    `,
    [status, id]
  );
}

export async function deleteContactMessage(
  id: number
): Promise<void> {
  await ensureDatabase();

  await pool.query(
    "DELETE FROM contact_messages WHERE id = $1",
    [id]
  );
}
