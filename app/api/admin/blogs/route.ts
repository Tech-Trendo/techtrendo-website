import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin";
import { revalidatePath, revalidateTag } from "next/cache";

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
  const allowed = new Set(["page", "page_size", "category", "search"]);
  const params: string[] = [];
  searchParams.forEach((value, key) => {
    if (allowed.has(key)) params.push(`${key}=${encodeURIComponent(value)}`);
  });
  const res = await adminFetch(`/api/app/blogs/${params.length ? `?${params.join("&")}` : ""}`);
  return passthrough(res);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  let options: Parameters<typeof adminFetch>[1];
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    options = { form };
  } else {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    options = { json };
  }

  const res = await adminFetch("/api/app/blogs/", { method: "POST", ...options });

  if (res.status === 201 || res.status === 200) {
    revalidateTag("blog", "default");
    revalidatePath("/blog", "page");
  }

  return passthrough(res);
}