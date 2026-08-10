import { NextResponse } from "next/server";
import { clearAdminCookies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearAdminCookies();
  return NextResponse.json({ ok: true });
}