export type seoData = {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
};

// --------------------------
// Country/market pages (hand-written content per market)
// --------------------------
export type MarketService = {
  id: number;
  title: string;
  slug: string;
};

export type MarketPortfolio = {
  id: number;
  title: string;
  slug: string;
  type: string;
  description: string;
};

export type MarketTestimonial = {
  id: number;
  author_name: string;
  text: string;
};

export type MarketPageBrief = {
  id: number;
  country_name: string;
  slug: string;
  status: "draft" | "published";
  timezone_note: string | null;
  updated_at: string | null;
};

export type MarketPage = MarketPageBrief & {
  hero_intro: string | null;
  services_offered: MarketService[];
  regional_portfolio: MarketPortfolio[];
  regional_testimonials: MarketTestimonial[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
};