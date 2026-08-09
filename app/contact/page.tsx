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
    "Contact Tech Trendo | Best IT Company in Itahari, Nepal",
    "Contact Tech Trendo for web development, mobile apps, software solutions, and digital marketing. Visit us in Sundarharaincha, Morang (Near Itahari), Nepal.",
  );
}
export default function page() {
  return <Contact />;
}
