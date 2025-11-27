import Contact from "@/components/client/ContactPage";
import { seoData } from "@/types";
import { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`https://app.techtrendo.com/api/app/pages/contact`);
  const data: seoData = await res.json();
  if (!data) {
    return {};
  }
  return {
    title: data.meta_title,
    description: data.meta_description,
    keywords: data.meta_keywords,
    alternates: {
      canonical: data.canonical_url,
    },
    openGraph: {
      title: data.og_title || "",
      description: data.og_description || "",
      url: data.canonical_url || "",
    },
    twitter: {
      card: "summary_large_image",
      title: data.twitter_title || data.title,
      description: data.twitter_description || "",
    },
  };
}
export default function page() {
  return <Contact />;
}
