import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage } from "@/lib/items";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  subject: z.string().max(300).optional().or(z.literal("")),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const id = createContactMessage(parsed.data);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
