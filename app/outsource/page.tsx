import { API_URL } from "@/lib/api";
import { Metadata } from "next";
import { seoData } from "@/types";
import OutsourcePage from "@/components/client/OutsourcePage";

interface ServiceFeature {
  title?: string;
  description?: string;
}

interface Service {
  id: number;
  slug: string;
  icon: string;
  title: string;
  short_description: string;
  long_description?: string;
  features: string[] | ServiceFeature[];
}

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      `${API_URL}/pages/outsource`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}

  return {
    title: data?.meta_title || "Outsource IT Projects - TechTrendo",
    description: data?.meta_description || "Partner with Tech Trendo to outsource your IT, software, and design projects to our expert development teams.",
    keywords: data?.meta_keywords || "IT outsourcing, software outsourcing, hire developers, Tech Trendo outsourcing",
    alternates: {
      canonical: data?.canonical_url || "https://techtrendo.com/outsource",
    },
    openGraph: {
      title: data?.og_title || data?.meta_title || "Outsource IT Projects - TechTrendo",
      description: data?.og_description || data?.meta_description || "",
      url: data?.canonical_url || "https://techtrendo.com/outsource",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.twitter_title || data?.meta_title || "Outsource IT Projects - TechTrendo",
      description: data?.twitter_description || data?.meta_description || "",
    },
  };
}

async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services/`, {
      next: { revalidate: 3600 }, // Revalidate every hour (ISR)
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

export default async function Outsource() {
  const services = await fetchServices();
  return <OutsourcePage initialServices={services} />;
}
