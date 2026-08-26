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

export interface AdminContactMessage {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  recaptcha_token: string;
  submitted_at: string;
}

export interface ContactMessageListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminContactMessage[];
}

export interface AdminBlogCategory {
  id: number;
  name: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

export interface AdminService {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  icon: string | null;
  image: string | null;
  features: { title: string; description: string }[];
  keybenefits: { title: string; description: string }[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  canonical_url: string | null;
  updated_at: string;
}

export interface AdminProduct {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  short_description: string;
  image: string | null;
  icon: string | null;
  link: string | null;
  usecase: string[];
  KeyBenefits: { title: string; description: string }[];
  features: { title: string; description: string }[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  updated_at: string;
}

export interface AdminPortfolio {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  description: string;
  points: string;
  type: "mobile_app" | "website" | "software";
  results: string;
  industry_tags: string[];
  region_tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  updated_at: string;
}

export interface AdminPage {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  updated_at: string;
}

export interface AdminTestimonial {
  id: number;
  author_name: string;
  author_image: string | null;
  text: string;
  meta_title: string | null;
  meta_description: string | null;
}

export interface AdminReview {
  id: number;
  reviewerName: string;
  reviewerRole: string;
  review: string;
  reviewerImage: string | null;
  reviewerCompanyLogo: string | null;
  reviewerWebsite: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface AdminEvent {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  date: string;
  image: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface AdminGalleryItem {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  size: "small" | "big";
  meta_title: string | null;
  meta_description: string | null;
}

export interface AdminCompanyLogo {
  id: number;
  name: string;
  image: string | null;
}

export interface AdminMarketPage {
  id: number;
  country_name: string;
  slug: string;
  hero_intro: string | null;
  services_offered: { id: number; title: string; slug: string }[];
  regional_portfolio: { id: number; title: string; slug: string; type: string; description: string }[];
  regional_testimonials: { id: number; author_name: string; text: string }[];
  timezone_note: string | null;
  status: "draft" | "published";
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  canonical_url: string | null;
  updated_at: string;
}

export interface AdminJob {
  id: number;
  slug: string;
  img: string | null;
  title: string;
  location: string;
  type: string;
  duration: string | null;
  description: string;
  requirements: string[];
  qualifications: string;
  deadline: string | null;
  date_posted: string;
  status: "OPEN" | "CLOSED";
  meta_title: string | null;
  meta_description: string | null;
}

export type AdminIntern = AdminJob;

export interface AdminMailSubscriber {
  id: number;
  email: string;
}

export interface AdminJobApplication {
  id: number;
  job: number;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume: string;
  submitted_at: string;
}

export interface AdminInternApplication {
  id: number;
  intern: number;
  intern_title: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume: string;
  submitted_at: string;
}

export interface AdminResume {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  resume: string;
  submitted_at: string;
}

export interface AdminSuggestTopic {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  submitted_at: string;
}

export interface AdminQuoteRequest {
  id: number;
  service: number | null;
  service_title: string | null;
  product: number | null;
  product_title: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  submitted_at: string;
}

export interface AdminSiteSettings {
  id: number;
  site_name: string;
  recaptcha_secret_key: string | null;
  recaptcha_site_key: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}