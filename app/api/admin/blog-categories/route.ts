import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminFetch } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await adminFetch("/api/app/blog-categories/?page_size=100");
  // The upstream may return non-JSON (e.g. an HTML error page from a stale
  // or misconfigured backend) — degrade gracefully instead of throwing 500.
  let data: { count?: number; results?: unknown[]; error?: string };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    return NextResponse.json(
      { error: `Backend returned a non-JSON response (status ${res.status}).` },
      { status: 502 },
    );
  }
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  return NextResponse.json({ count: data.count ?? (data.results ?? []).length, results: data.results ?? [] });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const res = await adminFetch("/api/app/blog-categories/", { method: "POST", json: body });
  if (res.status === 201 || res.status === 200) {
    revalidateTag("blog", "default");
  }
  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}