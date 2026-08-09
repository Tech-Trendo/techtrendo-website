import { API_URL } from "@/lib/api";
import Contact from "@/components/client/ContactPage";
import { seoData } from "@/types";
import { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      `${API_URL}/pages/contact`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return {
    title: data?.meta_title || "Contact - TechTrendo",
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
  return <Contact />;
}
