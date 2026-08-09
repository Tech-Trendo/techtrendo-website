import { API_URL } from "@/lib/api";
import {
  breadcrumbLd,
  canonicalUrl,
  seoMetadata,
  serviceLd,
  type SeoFields,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ServiceDetail from "@/components/client/ServiceSingle";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const REVALIDATE = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

type Service = SeoFields & {
  title: string;
  short_description: string;
  long_description?: string;
  features: { title?: string; description?: string }[];
};

async function fetchService(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${API_URL}/services/${slug}/`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchServiceSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/services/`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const services = await res.json();
    if (!Array.isArray(services)) return [];
    return services
      .map((service: { slug?: unknown }) => service?.slug)
      .filter((slug): slug is string => typeof slug === "string" && !!slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await fetchServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await fetchService(slug);
  if (!service) notFound();
  return seoMetadata(
    service,
    `/services/${slug}`,
    service.title,
    service.short_description,
  );
}

export default async function ServicePage(props: Props) {
  const { slug } = await props.params;
  const service = await fetchService(slug);
  if (!service) notFound();

  const canonical = canonicalUrl(service.canonical_url, `/services/${slug}`);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${slug}` },
        ])}
      />
      <JsonLd
        data={serviceLd({
          name: service.title,
          description:
            service.long_description || service.short_description,
          url: canonical,
        })}
      />
      <ServiceDetail />
    </>
  );
}