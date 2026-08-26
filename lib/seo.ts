import { API_BASE_URL } from "./api";
import type { Metadata } from "next";

export const SITE_NAME = "Tech Trendo";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://techtrendo.com";
export const FALLBACK_OG_IMAGE = `${SITE_URL}/preview.png`;
export const FALLBACK_OG_WIDTH = 1200;
export const FALLBACK_OG_HEIGHT = 630;

/**
 * Repair UTF-8 text that was double-decoded through Windows-1252 somewhere in
 * the CMS pipeline (e.g. "Tech Trendoâ€™s" instead of "Tech Trendo’s").
 * Applied defensively to CMS-provided strings at render time.
 */
const MOJIBAKE_REPLACEMENTS: [RegExp, string][] = [
  [/â€™/g, "\u2019"],
  [/â€˜/g, "\u2018"],
  [/â€œ/g, "\u201C"],
  [/â€\u009D/g, "\u201D"],
  [/â€\u201D/g, "\u2014"],
  [/â€\u201C/g, "\u2013"],
  [/â€¦/g, "\u2026"],
  [/â‚¬/g, "\u20AC"],
  [/\u00C2\u00A0/g, "\u00A0"],
];

export function fixMojibake(value: string | null | undefined): string {
  if (!value) return "";
  let out = value;
  if (/â€|Â/.test(out)) {
    for (const [pattern, replacement] of MOJIBAKE_REPLACEMENTS) {
      out = out.replace(pattern, replacement);
    }
  }
  return out;
}

/**
 * Strip duplicated "| Tech Trendo" brand suffixes from a raw title so the
 * layout template (or buildSeoTitle below) adds exactly one.
 */
function stripBrandSuffix(title: string): string {
  let t = title.trim();
  while (/\s*\|\s*Tech Trendo\s*$/i.test(t)) {
    t = t.replace(/\s*\|\s*Tech Trendo\s*$/i, "").trim();
  }
  return t;
}

function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "").trimEnd()}…`;
}

/**
 * Compose the final <title>: exactly one brand suffix, capped at 60 chars.
 * Returned as an absolute title so the layout template cannot append another
 * brand occurrence.
 */
export function buildSeoTitle(rawTitle: string): string {
  const base = stripBrandSuffix(fixMojibake(rawTitle));
  const withBrand = `${base} | ${SITE_NAME}`;
  if (withBrand.length <= 60) return withBrand;
  if (base.length <= 60) return base;
  return truncateWords(base, 60);
}

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

// Single-language, single-region site: emit only a canonical — no hreflang
// cluster (the previous en-US/en-GB/en-IN/x-default set all pointed at the
// same URL and was pure noise).
export function countryAlternates(url: string) {
  return { canonical: url };
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
  const rawTitle =
    fixMojibake(data?.meta_title) || stripBrandSuffix(fallbackTitle);
  // Absolute title: exactly one brand suffix, <=60 chars, immune to the
  // layout template appending another "| Tech Trendo".
  const title = buildSeoTitle(rawTitle);
  const ogTitle = stripBrandSuffix(
    fixMojibake(data?.og_title || data?.meta_title || fallbackTitle),
  );
  const ogDescription =
    fixMojibake(data?.og_description || data?.meta_description) ||
    fallbackDescription;
  const twitterImage = absoluteImageUrl(data?.twitter_image) ?? ogImage;

  return {
    title: { absolute: title },
    description:
      fixMojibake(data?.meta_description) ||
      fixMojibake(fallbackDescription),
    // Legacy <meta name="keywords"> intentionally not emitted (ignored by
    // Google and polluted topical signals).
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
      title: stripBrandSuffix(fixMojibake(data?.twitter_title)) || ogTitle,
      description:
        fixMojibake(data?.twitter_description) || ogDescription,
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
    postalCode: "56601",
    addressCountry: "NP",
  },
  // Markets served. Each one must have a real published /markets page with
  // hand-written content before being added here.
  areaServed: [
    { "@type": "Country", name: "Nepal" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "India" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "New Zealand" },
  ],
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
  serviceType?: string;
  description: string;
  url: string;
  image?: string | null;
  areaServed?: string[];
}) {
  // areaServed is the Google-sanctioned way to signal "we serve this region".
  // Market pages pass their country; service pages keep a global default that
  // mirrors organizationLd.areaServed — keep both lists in sync.
  const globalAreas = [
    "Nepal",
    "Australia",
    "India",
    "United Arab Emirates",
    "New Zealand",
  ];
  const areaServed = data.areaServed
    ? data.areaServed.map((name) => ({ "@type": "Country", name }))
    : globalAreas.map((name) => ({ "@type": "Country", name }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    serviceType: data.serviceType || data.name,
    description: data.description,
    url: data.url,
    image: data.image ? absoluteImageUrl(data.image) : undefined,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: data.url,
    },
  };
}

/**
 * Product markup WITHOUT any Offer/price object — pricing is not displayed
 * anywhere on the site, so no price-bearing schema is emitted (a placeholder
 * price previously risked rendering products as $0.00 in rich results).
 */
export function productLd(data: {
  name: string;
  description?: string;
  url: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: fixMojibake(data.description) || "",
    url: data.url,
    image: data.image ? absoluteImageUrl(data.image) : FALLBACK_OG_IMAGE,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
  };
}

export function contactPageLd(data: { url: string; name: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${data.url}#contactpage`,
    url: data.url,
    name: data.name,
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: "info@techtrendo.com",
      telephone: "+977-9815602535",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+977-9815602535",
        email: "info@techtrendo.com",
        availableLanguage: ["English", "Nepali"],
      },
    },
  };
}

export function itemListLd(items: { name: string; path: string }[], listUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: listUrl,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
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