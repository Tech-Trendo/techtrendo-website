import { API_URL } from "@/lib/api";
import { Metadata } from "next";
import Portfolio from "@/components/portfolio";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  type: "mobile_app" | "software" | "website";
  points?: string;
  link?: string;
}

async function fetchPortfolio(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/portfolio/`, {
      next: { revalidate: 3600, tags: ["portfolio"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Portfolio | Tech Trendo",
  description:
    "Explore our diverse portfolio of mobile apps, software, and web development projects delivered for businesses worldwide.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default async function PortfolioPage() {
  const portfolio = await fetchPortfolio();

  return (
    <div className="flex flex-col">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
        ])}
      />
      <Portfolio projects={portfolio} />
    </div>
  );
}