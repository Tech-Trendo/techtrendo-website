import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { adminFetch } from "@/lib/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

async function passthrough(res: Response): Promise<NextResponse> {
  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const res = await adminFetch(`/api/app/blogs/${encodeURIComponent(slug)}/`);
  return passthrough(res);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
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

  const res = await adminFetch(`/api/app/blogs/${encodeURIComponent(slug)}/`, {
    method: "PATCH",
    ...options,
  });

  if (res.status === 200 || res.status === 201) {
    revalidateTag("blog", "default");
    revalidatePath(`/blog/${slug}`, "page");
    revalidatePath("/blog", "page");
  }

  return passthrough(res);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const res = await adminFetch(`/api/app/blogs/${encodeURIComponent(slug)}/`, {
    method: "DELETE",
  });

  if (res.status === 204) {
    revalidateTag("blog", "default");
    revalidatePath(`/blog/${slug}`, "page");
    revalidatePath("/blog", "page");
    return NextResponse.json({ ok: true });
  }
  return passthrough(res);
}