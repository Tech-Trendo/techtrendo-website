import { cookies } from "next/headers";
import { API_BASE_URL, API_URL } from "./api";

export const ADMIN_ACCESS_COOKIE = "admin_access";
export const ADMIN_REFRESH_COOKIE = "admin_refresh";
export const ADMIN_SESSION_COOKIE = "admin_session";

export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/accounts/api/superadmin/login/`;
export const REFRESH_ENDPOINT = `${API_BASE_URL}/api/token/refresh/`;
export const BLOGS_ENDPOINT = `${API_URL}/blogs/`;
export const BLOG_CATEGORIES_ENDPOINT = `${API_URL}/blog-categories/`;

const ACCESS_TTL_SECONDS = 60 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

function cookieSecure(): boolean {
  return process.env.ADMIN_COOKIE_INSECURE === "true"
    ? false
    : process.env.NODE_ENV === "production";
}

export interface AdminCookies {
  access?: string;
  refresh?: string;
}

export async function getAdminCookies(): Promise<AdminCookies> {
  const store = await cookies();
  return {
    access: store.get(ADMIN_ACCESS_COOKIE)?.value,
    refresh: store.get(ADMIN_REFRESH_COOKIE)?.value,
  };
}

export async function setAdminCookies(access: string, refresh: string): Promise<void> {
  const store = await cookies();
  const base = {
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
  };
  store.set(ADMIN_ACCESS_COOKIE, access, { ...base, httpOnly: true, maxAge: ACCESS_TTL_SECONDS });
  store.set(ADMIN_REFRESH_COOKIE, refresh, { ...base, httpOnly: true, maxAge: REFRESH_TTL_SECONDS });
  store.set(ADMIN_SESSION_COOKIE, "1", { ...base, httpOnly: false, maxAge: REFRESH_TTL_SECONDS });
}

export async function clearAdminCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_ACCESS_COOKIE);
  store.delete(ADMIN_REFRESH_COOKIE);
  store.delete(ADMIN_SESSION_COOKIE);
}

async function refreshAccessToken(refresh: string): Promise<string | null> {
  try {
    const res = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access?: string };
    return data.access ?? null;
  } catch {
    return null;
  }
}

export interface AdminFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  json?: unknown;
  form?: FormData;
}

/**
 * Authenticated fetch proxy to the Django API. Uses the httpOnly access cookie,
 * silently refreshes once on 401, and returns the raw Response.
 */
export async function adminFetch(
  path: string,
  options: AdminFetchOptions = {},
): Promise<Response> {
  const { access, refresh } = await getAdminCookies();

  const buildInit = (token: string): RequestInit => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    let body: BodyInit | undefined;
    if (options.json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.json);
    } else if (options.form !== undefined) {
      body = options.form;
    }
    return {
      method: options.method ?? "GET",
      headers,
      body,
      cache: "no-store",
    };
  };

  const doFetch = (token: string): Promise<Response> =>
    fetch(`${API_BASE_URL}${path}`, buildInit(token));

  const unauthorized = (): Response =>
    new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  if (!access) {
    if (!refresh) {
      return unauthorized();
    }
    const refreshed = await refreshAccessToken(refresh);
    if (!refreshed) {
      await clearAdminCookies();
      return unauthorized();
    }
    const store = await cookies();
    store.set(ADMIN_ACCESS_COOKIE, refreshed, {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure(),
      path: "/",
      maxAge: ACCESS_TTL_SECONDS,
    });
    return doFetch(refreshed);
  }

  let res = await doFetch(access);

  if (res.status === 401 && refresh) {
    const newAccess = await refreshAccessToken(refresh);
    if (newAccess) {
      const store = await cookies();
      store.set(ADMIN_ACCESS_COOKIE, newAccess, {
        httpOnly: true,
        sameSite: "lax",
        secure: cookieSecure(),
        path: "/",
        maxAge: ACCESS_TTL_SECONDS,
      });
      res = await doFetch(newAccess);
    } else {
      await clearAdminCookies();
    }
  }
  return res;
}