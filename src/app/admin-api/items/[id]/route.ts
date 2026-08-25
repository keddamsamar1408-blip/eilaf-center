import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { getItem, updateItem, deleteItem } from "@/lib/items";

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const item = getItem(Number(id));
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const existing = getItem(Number(id));
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", details: parsed.error.flatten() }, { status: 400 });
  }

  updateItem(Number(id), parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  deleteItem(Number(id));
  return NextResponse.json({ ok: true });
}
