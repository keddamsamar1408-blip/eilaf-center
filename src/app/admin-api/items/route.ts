import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { listItems, createItem } from "@/lib/items";

const itemSchema = z.object({
  category: z.enum(["support", "course", "education", "event"]),
  title_ar: z.string().min(1),
  title_fr: z.string().optional(),
  title_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  mode: z.enum(["in_person", "zoom", "google_meet", "hybrid"]),
  meeting_link: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().optional(),
  start_time: z.string().optional(),
  end_date: z.string().optional(),
  end_time: z.string().optional(),
  price: z.string().optional(),
  capacity: z.coerce.number().optional(),
  image_url: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().optional(),
});

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const items = listItems({ includeAll: true });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", details: parsed.error.flatten() }, { status: 400 });
  }

  const id = createItem(parsed.data);
  return NextResponse.json({ ok: true, id });
}
