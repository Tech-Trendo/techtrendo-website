import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: cookie names duplicated here on purpose (lib/admin.ts imports
// server-only modules that cannot be bundled into the edge proxy runtime).
const ACCESS_COOKIE = "admin_access";
const REFRESH_COOKIE = "admin_refresh";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const hasToken =
    request.cookies.get(ACCESS_COOKIE)?.value || request.cookies.get(REFRESH_COOKIE)?.value;

  if (hasToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};