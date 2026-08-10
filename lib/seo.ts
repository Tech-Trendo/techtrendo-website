import { API_BASE_URL } from "./api";
import type { Metadata } from "next";

export const SITE_NAME = "Tech Trendo";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://techtrendo.com";
export const FALLBACK_OG_IMAGE = `${SITE_URL}/preview.png`;
export const FALLBACK_OG_WIDTH = 1200;
export const FALLBACK_OG_HEIGHT = 630;

export type SeoFields = {
  title?: string | null;
  slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
};

function normalizePath(path: string): string {
  const stripped = path.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

function isSameRouteUrl(candidate: string, path: string): boolean {
  try {
    const url = new URL(candidate);
    const siteUrl = new URL(SITE_URL);
    return (
      url.hostname === siteUrl.hostname &&
      normalizePath(url.pathname) === normalizePath(path)
    );
  } catch {
    return false;
  }
}

export function canonicalUrl(
  canonical: string | null | undefined,
  path: string,
): string {
  const derived = `${SITE_URL}${path}`;
  if (!canonical || !canonical.trim()) {
    return derived;
  }
  if (!isSameRouteUrl(canonical.trim(), path)) {
    return derived;
  }
  return derived;
}

export const COUNTRY_REGIONS = ["en-US", "en-GB", "en-IN"] as const;

export function countryAlternates(url: string) {
  const languages: Record<string, string> = { "x-default": url };
  for (const locale of COUNTRY_REGIONS) languages[locale] = url;
  return { canonical: url, languages };
}

export function absoluteImageUrl(
  image: string | null | undefined,
): string | undefined {
  if (!image || !image.trim()) return undefined;
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith("/")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/${image}`;
}

export function seoMetadata(
  data: SeoFields | null | undefined,
  path: string,
  fallbackTitle: string,
  fallbackDescription: string,
): Metadata {
  const canonical = canonicalUrl(data?.canonical_url, path);
  const ogImage = absoluteImageUrl(data?.og_image) ?? FALLBACK_OG_IMAGE;
  const ogTitle =
    data?.og_title || data?.meta_title || fallbackTitle;
  const ogDescription =
    data?.og_description || data?.meta_description || fallbackDescription;
  const twitterImage = absoluteImageUrl(data?.twitter_image) ?? ogImage;

  return {
    title: data?.meta_title || fallbackTitle,
    description: data?.meta_description || fallbackDescription,
    keywords: data?.meta_keywords || undefined,
    alternates: countryAlternates(canonical),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: FALLBACK_OG_WIDTH,
          height: FALLBACK_OG_HEIGHT,
          alt: ogTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.twitter_title || ogTitle,
      description: data?.twitter_description || ogDescription,
      images: [twitterImage],
    },
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/preview.png`,
    width: FALLBACK_OG_WIDTH,
    height: FALLBACK_OG_HEIGHT,
  },
  email: "info@techtrendo.com",
  telephone: "+977-9815602535",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sundarharaincha, Morang (Near Itahari)",
    addressLocality: "Sundarharaincha",
    addressRegion: "Koshi Pradesh",
    addressCountry: "NP",
  },
  sameAs: [
    "https://www.facebook.com/techtrendo.np",
    "https://www.linkedin.com/company/tech-trendo/",
    "https://www.instagram.com/tech.trendo.np/",
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const publisherLd = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/preview.png`,
    width: FALLBACK_OG_WIDTH,
    height: FALLBACK_OG_HEIGHT,
  },
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function blogPostingLd(data: {
  headline: string;
  description: string;
  image: string | null | undefined;
  datePublished: string;
  dateModified?: string;
  canonical: string;
  categoryName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": data.canonical },
    headline: data.headline,
    description: data.description,
    image: data.image ? absoluteImageUrl(data.image) : FALLBACK_OG_IMAGE,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    articleSection: data.categoryName || undefined,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: publisherLd,
    inLanguage: "en",
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceLd(data: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image ? absoluteImageUrl(data.image) : undefined,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: [
      { "@type": "Country", name: "Nepal" },
      { "@type": "AdministrativeArea", name: "Global" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: data.url,
    },
  };
}

export function productLd(data: {
  name: string;
  description?: string;
  url: string;
  image?: string | null;
  offersPrice?: number | null;
  priceCurrency?: string;
}) {
  const offers = data.offersPrice
    ? {
        "@type": "Offer",
        price: String(data.offersPrice),
        priceCurrency: data.priceCurrency || "USD",
        availability: "https://schema.org/InStock",
      }
    : { "@type": "Offer", price: "0", priceCurrency: "USD", priceValidUntil: "2030-12-31", availability: "https://schema.org/ContactForPrice" };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description || "",
    url: data.url,
    image: data.image ? absoluteImageUrl(data.image) : FALLBACK_OG_IMAGE,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    offers,
  };
}

export function jobPostingLd(data: {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  datePosted: string;
  validThrough?: string | null;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: data.title,
    description: data.description,
    datePosted: data.datePosted,
    validThrough: data.validThrough || undefined,
    employmentType: data.employmentType,
    hiringOrganization: { "@id": `${SITE_URL}/#organization` },
    jobLocation: {
      "@type": "Place",
      name: data.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: "NP",
        addressLocality: data.location,
      },
    },
    url: data.url,
  };
}

export function courseLd(data: {
  name: string;
  description?: string;
  provider?: { name: string; url: string };
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: data.name,
    description: data.description || "",
    image: data.image ? absoluteImageUrl(data.image) : FALLBACK_OG_IMAGE,
    provider: data.provider || {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT2M",
    },
  };
}