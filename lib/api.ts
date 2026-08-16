// === API BASE URL ===
// Reads from NEXT_PUBLIC_API_URL env var (set in .env.local or the hosting platform).
// Defaults to localhost:8000 for local development.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const API_URL = `${API_BASE_URL}/api/app`;

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
  "6LfeReYrAAAAAL-1oIYBYCBs1wQ7I_x_-Rc7At8O";