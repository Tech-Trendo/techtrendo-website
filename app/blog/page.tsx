import { API_URL } from "@/lib/api";
import Blog from "@/components/client/BlogPage";
import { seoData } from "@/types";
import { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(`${API_URL}/pages/blog`, {
      next: { revalidate: 3600, tags: ["page"] },
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return seoMetadata(
    data,
    "/blog",
    "Blog | Tech Trendo - Insights on Web, Apps, Software & Digital Marketing",
    "Read the latest insights from Tech Trendo on web development, mobile apps, custom software, digital marketing, and outsourcing across global markets.",
  );
}
export default function page() {
  return <Blog />;
}
