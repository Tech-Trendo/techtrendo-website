export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
}

export interface AdminBlog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  pub_date: string;
  is_featured: boolean;
  category: AdminCategory | null;
  category_id: number | null;
  read_time: number;
  faq: { question: string; answer: string }[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  canonical_url: string | null;
}

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminBlog[];
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  ok: boolean;
  username?: string;
}