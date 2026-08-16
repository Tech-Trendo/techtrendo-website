import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function passthrough(res: Response): Promise<NextResponse> {
  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const allowed = new Set(["page", "page_size", "search", "service"]);
  const params: string[] = [];
  searchParams.forEach((value, key) => {
    if (allowed.has(key)) params.push(`${key}=${encodeURIComponent(value)}`);
  });
  const res = await adminFetch(`/api/app/contact-messages/${params.length ? `?${params.join("&")}` : ""}`);
  return passthrough(res);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await adminFetch(`/api/app/contact-messages/${id}/`, { method: "DELETE" });

  if (res.status === 204 || res.status === 200) {
    revalidatePath("/admin/contact-messages");
  }

  return passthrough(res);
}