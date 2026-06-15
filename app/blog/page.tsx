import Blog from "@/components/client/BlogPage";
import { seoData } from "@/types";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch("https://app.techtrendo.com/api/app/pages/blog", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return {
    title: data?.meta_title || "Blog - TechTrendo",
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
  return <Blog />;
}
