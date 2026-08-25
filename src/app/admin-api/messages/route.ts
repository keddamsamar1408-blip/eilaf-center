import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { listContactMessages } from "@/lib/items";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const messages = listContactMessages();
  return NextResponse.json({ messages });
}
