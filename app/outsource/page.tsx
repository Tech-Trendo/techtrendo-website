import { API_URL } from "@/lib/api";
import { Metadata } from "next";
import { seoData } from "@/types";
import OutsourcePage from "@/components/client/OutsourcePage";
import { seoMetadata } from "@/lib/seo";

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
        next: { revalidate: 3600, tags: ["page"] },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}

  return seoMetadata(
    data,
    "/outsource",
    "Outsource IT Projects to Nepal | Tech Trendo",
    "Partner with Tech Trendo to outsource your IT, software, and design projects to expert development teams in Nepal.",
  );
}

async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services/`, {
      next: { revalidate: 3600, tags: ["service"] }, // Revalidate every hour (ISR) + on-demand
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
