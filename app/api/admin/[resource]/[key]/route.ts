import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { adminFetch } from "@/lib/admin";
import { ADMIN_RESOURCES } from "@/lib/admin-resources";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ resource: string; key: string }> };

async function passthrough(res: Response): Promise<NextResponse> {
  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { resource, key } = await context.params;
  const config = ADMIN_RESOURCES[resource];
  if (!config) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const res = await adminFetch(`${config.backend}/${encodeURIComponent(key)}/`);
  return passthrough(res);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { resource, key } = await context.params;
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

  const res = await adminFetch(`${config.backend}/${encodeURIComponent(key)}/`, {
    method: "PATCH",
    ...options,
  });

  if (res.status === 200 || res.status === 201) {
    for (const tag of config.revalidateTags ?? []) revalidateTag(tag, "default");
    for (const path of config.revalidatePaths ?? []) revalidatePath(path, "page");
  }

  return passthrough(res);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { resource, key } = await context.params;
  const config = ADMIN_RESOURCES[resource];
  if (!config) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  const res = await adminFetch(`${config.backend}/${encodeURIComponent(key)}/`, {
    method: "DELETE",
  });

  if (res.status === 204 || res.status === 200) {
    for (const tag of config.revalidateTags ?? []) revalidateTag(tag, "default");
    for (const path of config.revalidatePaths ?? []) revalidatePath(path, "page");
    return NextResponse.json({ ok: true });
  }
  return passthrough(res);
}
