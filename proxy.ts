import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Canonical host is the apex domain (https://techtrendo.com).
// www.<host> requests 308-redirect to the apex so canonicals, sitemap URLs,
// and JSON-LD entity URLs all resolve on the host they are served from.
function redirectToApex(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host") ?? "";
  if (!host.startsWith("www.")) return null;
  const url = request.nextUrl.clone();
  url.host = host.slice(4);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) url.protocol = forwardedProto;
  return NextResponse.redirect(url, 308);
}

// NOTE: cookie names duplicated here on purpose (lib/admin.ts imports
// server-only modules that cannot be bundled into the edge proxy runtime).
const ACCESS_COOKIE = "admin_access";
const REFRESH_COOKIE = "admin_refresh";

export function proxy(request: NextRequest) {
  const wwwRedirect = redirectToApex(request);
  if (wwwRedirect) return wwwRedirect;

  const { pathname } = request.nextUrl;

  // Admin-auth gate only applies to dashboard routes.
  if (!pathname.startsWith("/dash")) {
    return NextResponse.next();
  }

  if (pathname === "/dash/login" || pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const hasToken =
    request.cookies.get(ACCESS_COOKIE)?.value || request.cookies.get(REFRESH_COOKIE)?.value;

  if (hasToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/dash/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dash/:path*",
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
