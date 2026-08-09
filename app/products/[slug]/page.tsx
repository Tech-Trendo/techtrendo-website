import { API_URL } from "@/lib/api";
import ProductDetail from "@/components/client/ProductSingle";
import { seoData } from "@/types";
import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string }>; // Important in React 19 + Next.js 15+
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
// 1. Tell Next.js which slugs exist so it can pre-build the HTML files
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/products/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const products = await res.json();
    if (!Array.isArray(products)) return [];
    const slugs: { slug: string }[] = [];
    for (const product of products) {
      if (product && typeof product.slug === "string" && product.slug) {
        slugs.push({ slug: product.slug });
      }
    }
    return slugs;
  } catch (error) {
    console.error("Failed to fetch product slugs for static generation:", error);
    return [];
  }
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const params = await props.params;
    const { slug } = params;
    const res = await fetch(
      `${API_URL}/products/${slug}/`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return {
    title: data?.meta_title,
    description: data?.meta_description,
    keywords: data?.meta_keywords,
    alternates: {
      canonical: data?.canonical_url,
    },
    openGraph: {
      title: data?.og_title || "",
      description: data?.og_description || "",
      url: data?.canonical_url || "",
    },

    twitter: {
      card: "summary_large_image",
      title: data?.twitter_title || data?.title,
      description: data?.twitter_description || "",
    },
  };
}
export default function page() {
  return <ProductDetail />;
}
