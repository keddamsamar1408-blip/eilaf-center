import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllSettings, setSetting } from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  return NextResponse.json({ settings: getAllSettings() });
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      setSetting(key, value);
    }
  }

  return NextResponse.json({ ok: true, settings: getAllSettings() });
}
