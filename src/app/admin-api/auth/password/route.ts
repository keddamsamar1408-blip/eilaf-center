import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin, authenticateAdmin, changeAdminPassword } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const verify = authenticateAdmin(admin.email, parsed.data.currentPassword);
  if (!verify) return NextResponse.json({ error: "wrong_current_password" }, { status: 401 });

  changeAdminPassword(admin.id, parsed.data.newPassword);
  return NextResponse.json({ ok: true });
}
