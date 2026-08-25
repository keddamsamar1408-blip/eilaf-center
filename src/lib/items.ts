import { db } from "./db";

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

export function listItems(opts: {
  category?: ItemCategory;
  status?: ItemStatus;
  includeAll?: boolean; // admin view: include drafts/archived
} = {}): Item[] {
  const clauses: string[] = [];
  const params: Record<string, string> = {};

  if (opts.category) {
    clauses.push("category = @category");
    params.category = opts.category;
  }
  if (!opts.includeAll) {
    clauses.push("status = 'published'");
  } else if (opts.status) {
    clauses.push("status = @status");
    params.status = opts.status;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT * FROM items ${where} ORDER BY featured DESC, COALESCE(start_date, created_at) DESC, id DESC`)
    .all(params) as Item[];
}

export function getItem(id: number): Item | undefined {
  return db.prepare("SELECT * FROM items WHERE id = ?").get(id) as Item | undefined;
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

export function createItem(input: ItemInput): number {
  const stmt = db.prepare(`
    INSERT INTO items (
      category, title_ar, title_fr, title_en, description_ar, description_fr, description_en,
      mode, meeting_link, location, start_date, start_time, end_date, end_time,
      price, capacity, image_url, status, featured, updated_at
    ) VALUES (
      @category, @title_ar, @title_fr, @title_en, @description_ar, @description_fr, @description_en,
      @mode, @meeting_link, @location, @start_date, @start_time, @end_date, @end_time,
      @price, @capacity, @image_url, @status, @featured, datetime('now')
    )
  `);
  const result = stmt.run({
    category: input.category,
    title_ar: input.title_ar,
    title_fr: input.title_fr ?? null,
    title_en: input.title_en ?? null,
    description_ar: input.description_ar ?? null,
    description_fr: input.description_fr ?? null,
    description_en: input.description_en ?? null,
    mode: input.mode,
    meeting_link: input.meeting_link ?? null,
    location: input.location ?? null,
    start_date: input.start_date ?? null,
    start_time: input.start_time ?? null,
    end_date: input.end_date ?? null,
    end_time: input.end_time ?? null,
    price: input.price ?? null,
    capacity: input.capacity ?? null,
    image_url: input.image_url ?? null,
    status: input.status,
    featured: input.featured ? 1 : 0,
  });
  return Number(result.lastInsertRowid);
}

export function updateItem(id: number, input: ItemInput): void {
  const stmt = db.prepare(`
    UPDATE items SET
      category = @category, title_ar = @title_ar, title_fr = @title_fr, title_en = @title_en,
      description_ar = @description_ar, description_fr = @description_fr, description_en = @description_en,
      mode = @mode, meeting_link = @meeting_link, location = @location,
      start_date = @start_date, start_time = @start_time, end_date = @end_date, end_time = @end_time,
      price = @price, capacity = @capacity, image_url = @image_url, status = @status, featured = @featured,
      updated_at = datetime('now')
    WHERE id = @id
  `);
  stmt.run({
    id,
    category: input.category,
    title_ar: input.title_ar,
    title_fr: input.title_fr ?? null,
    title_en: input.title_en ?? null,
    description_ar: input.description_ar ?? null,
    description_fr: input.description_fr ?? null,
    description_en: input.description_en ?? null,
    mode: input.mode,
    meeting_link: input.meeting_link ?? null,
    location: input.location ?? null,
    start_date: input.start_date ?? null,
    start_time: input.start_time ?? null,
    end_date: input.end_date ?? null,
    end_time: input.end_time ?? null,
    price: input.price ?? null,
    capacity: input.capacity ?? null,
    image_url: input.image_url ?? null,
    status: input.status,
    featured: input.featured ? 1 : 0,
  });
}

export function deleteItem(id: number): void {
  db.prepare("DELETE FROM items WHERE id = ?").run(id);
}

// Contact messages
export interface ContactMessageInput {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  item_id?: number;
}

export function createContactMessage(input: ContactMessageInput): number {
  const result = db
    .prepare(
      `INSERT INTO contact_messages (name, email, phone, subject, message, item_id)
       VALUES (@name, @email, @phone, @subject, @message, @item_id)`
    )
    .run({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      subject: input.subject ?? null,
      message: input.message,
      item_id: input.item_id ?? null,
    });
  return Number(result.lastInsertRowid);
}

export function listContactMessages() {
  return db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all();
}

export function updateMessageStatus(id: number, status: string) {
  db.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").run(status, id);
}

export function deleteContactMessage(id: number) {
  db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
}
