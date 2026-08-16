import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { adminFetch } from "@/lib/admin";
import { ADMIN_RESOURCES } from "@/lib/admin-resources";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ resource: string }> };

async function passthrough(res: Response): Promise<NextResponse> {
  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { resource } = await context.params;
  const config = ADMIN_RESOURCES[resource];
  if (!config) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  const { searchParams } = request.nextUrl;
  const allowed = new Set(["page", "page_size", "search"]);
  const params: string[] = [];
  searchParams.forEach((value, key) => {
    if (allowed.has(key)) params.push(`${key}=${encodeURIComponent(value)}`);
  });
  const res = await adminFetch(`${config.backend}/${params.length ? `?${params.join("&")}` : ""}`);
  return passthrough(res);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { resource } = await context.params;
  const config = ADMIN_RESOURCES[resource];
  if (!config) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

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

  const res = await adminFetch(`${config.backend}/`, { method: "POST", ...options });

  if (res.status === 201 || res.status === 200) {
    for (const tag of config.revalidateTags ?? []) revalidateTag(tag, "default");
    for (const path of config.revalidatePaths ?? []) revalidatePath(path, "page");
  }

  return passthrough(res);
}
