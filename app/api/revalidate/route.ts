import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.REVALIDATE_SECRET;

const ALLOWED_TAGS = new Set([
  "blog",
  "product",
  "service",
  "page",
  "job",
  "review",
  "gallery",
  "portfolio",
  "market",
]);

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured on this server." },
      { status: 500 },
    );
  }

  let body: { secret?: string; tags?: string[]; paths?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.secret !== SECRET) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];
  const paths = Array.isArray(body.paths) ? body.paths : [];

  for (const tag of tags) {
    if (ALLOWED_TAGS.has(tag)) {
      revalidateTag(tag, "default");
    }
  }

  for (const path of paths) {
    revalidatePath(path, "page");
  }

  return NextResponse.json({
    ok: true,
    revalidatedTags: tags.filter((t) => ALLOWED_TAGS.has(t)),
    revalidatedPaths: paths,
  });
}