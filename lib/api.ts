// === API BASE URL (toggle between the two) ===
// DEVELOPMENT:
export const API_BASE_URL = "http://localhost:8000";
// PRODUCTION (comment the line above and uncomment this when deploying):
// export const API_BASE_URL = "https://app.techtrendo.com";

export const API_URL = `${API_BASE_URL}/api/app`;

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
  "6LfeReYrAAAAAL-1oIYBYCBs1wQ7I_x_-Rc7At8O";