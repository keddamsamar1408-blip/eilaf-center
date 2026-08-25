import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateAdmin, signToken, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const admin = authenticateAdmin(parsed.data.email, parsed.data.password);
    if (!admin) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const token = signToken(admin);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, admin });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
