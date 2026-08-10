import { NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await adminFetch("/api/app/blog-categories/?page_size=100");
  const data = (await res.json()) as { results?: unknown[]; error?: string };
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  return NextResponse.json({ results: data.results ?? [] });
}