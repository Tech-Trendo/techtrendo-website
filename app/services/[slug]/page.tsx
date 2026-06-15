import ServiceDetail from "@/components/client/ServiceSingle";
import { seoData } from "@/types";
import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string }>; // Important in React 19 + Next.js 15+
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata(props: Props): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const params = await props.params;
    const { slug } = params;
    const res = await fetch(
      `https://app.techtrendo.com/api/app/services/${slug}/`,
      {
        next: { revalidate: 3600 },
      }
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
  return <ServiceDetail />;
}
