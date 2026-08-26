import { NextRequest, NextResponse } from "next/server";
import { LOGIN_ENDPOINT, setAdminCookies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const res = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Invalid credentials or not authorized." },
      { status: 401 },
    );
  }

  let data: { access: string; refresh: string };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    return NextResponse.json(
      { error: "Login service returned an invalid response. Try again shortly." },
      { status: 502 },
    );
  }

  await setAdminCookies(data.access, data.refresh);

  return NextResponse.json({ ok: true, username });
}