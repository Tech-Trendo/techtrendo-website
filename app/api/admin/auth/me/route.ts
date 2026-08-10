import { NextResponse } from "next/server";
import {
  getAdminCookies,
  REFRESH_ENDPOINT,
  setAdminCookies,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { access, refresh } = await getAdminCookies();

  if (access || !refresh) {
    return NextResponse.json({ authenticated: Boolean(access) });
  }

  const res = await fetch(REFRESH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ authenticated: false });
  }
  const data = (await res.json()) as { access: string };
  await setAdminCookies(data.access, refresh);
  return NextResponse.json({ authenticated: true });
}