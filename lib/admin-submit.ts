/** Extract the first human-readable error message from a failed API response. */
export async function apiErrorText(res: Response): Promise<string | null> {
  try {
    const data = (await res.json()) as Record<string, unknown>;
    if (data && typeof data === "object") {
      for (const key of ["detail", "non_field_errors"]) {
        const v = data[key];
        if (typeof v === "string") return v;
        if (Array.isArray(v) && v.length > 0) return String(v[0]);
      }
      for (const value of Object.values(data)) {
        if (Array.isArray(value) && value.length > 0) return String(value[0]);
        if (typeof value === "string") return value;
      }
    }
  } catch {
    /* not JSON */
  }
  return null;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Submit an admin resource to the frontend proxy. Sends JSON normally;
 * switches to multipart/form-data when any file is provided so image fields
 * can be uploaded. Arrays/objects are JSON-stringified in multipart mode
 * (matching how the blog form sends its FAQ JSON field).
 */
export async function submitAdminResource(
  url: string,
  method: "POST" | "PATCH",
  payload: Record<string, unknown>,
  files?: Record<string, File | null>,
): Promise<Response> {
  const hasFile =
    files !== undefined && Object.values(files).some((file) => file !== null && file !== undefined);

  if (hasFile) {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === "boolean") {
        form.append(key, value ? "true" : "false");
      } else if (typeof value === "object") {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    });
    Object.entries(files ?? {}).forEach(([key, file]) => {
      if (file) form.append(key, file);
    });
    return fetch(url, { method, body: form, cache: "no-store" });
  }

  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}
