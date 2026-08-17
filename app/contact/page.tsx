import { API_URL } from "@/lib/api";
import Contact from "@/components/client/ContactPage";
import { seoData } from "@/types";
import { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";
export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      `${API_URL}/pages/contact`,
      {
        next: { revalidate: 3600, tags: ["page"] },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return seoMetadata(
    data,
    "/contact",
    "Contact Tech Trendo | Global Software Development Team",
    "Contact Tech Trendo for web development, mobile apps, software solutions, and digital marketing. Based in Itahari, Nepal, serving clients worldwide.",
  );
}
export default function page() {
  return <Contact />;
}
