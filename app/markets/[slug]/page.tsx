import { API_URL } from "@/lib/api";
import {
  breadcrumbLd,
  canonicalUrl,
  seoMetadata,
  serviceLd,
  type SeoFields,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketPage } from "@/types";

const REVALIDATE = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

type MarketListItem = SeoFields & {
  slug?: string | null;
  status?: string | null;
};

async function fetchMarket(slug: string): Promise<MarketPage | null> {
  try {
    const res = await fetch(`${API_URL}/markets/${slug}/`, {
      next: { revalidate: REVALIDATE, tags: ["market"] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchMarketSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/markets/`, {
      next: { revalidate: REVALIDATE, tags: ["market"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: MarketListItem[] = Array.isArray(data)
      ? data
      : data?.results ?? [];
    // Only published markets are statically generated; drafts stay noindex.
    return list
      .filter((m) => m?.status === "published" && typeof m?.slug === "string")
      .map((m) => m.slug as string);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await fetchMarketSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const market = await fetchMarket(slug);
  if (!market) notFound();

  const fallbackTitle = `${market.country_name} Software Development Services | Tech Trendo`;
  const fallbackDescription =
    market.meta_description ||
    `Tech Trendo provides web, app and software development services for clients in ${market.country_name}.`;

  const base = seoMetadata(
    market,
    `/markets/${slug}`,
    fallbackTitle,
    fallbackDescription,
  );

  const isPublished = market.status === "published";
  return {
    ...base,
    title: market.meta_title || fallbackTitle,
    description: base.description,
    robots: isPublished
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function MarketPageRoute(props: Props) {
  const { slug } = await props.params;
  const market = await fetchMarket(slug);
  if (!market) notFound();

  const isPublished = market.status === "published";
  const canonical = canonicalUrl(market.canonical_url, `/markets/${slug}`);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Markets", path: "/markets" },
          { name: market.country_name, path: `/markets/${slug}` },
        ])}
      />
      {isPublished && (
        <JsonLd
          data={serviceLd({
            name: `IT services in ${market.country_name}`,
            description:
              market.meta_description ||
              market.timezone_note ||
              `Tech Trendo software development services for clients in ${market.country_name}.`,
            url: canonical,
            areaServed: [market.country_name],
          })}
        />
      )}

      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom space-y-6">
          {!isPublished && (
            <div className="inline-flex items-center rounded-md bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 text-sm font-medium text-amber-100">
              DRAFT — under review, not indexed
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold">
            {market.country_name}
          </h1>
          {market.timezone_note && (
            <p className="flex items-center space-x-2 text-white/90 text-lg">
              <Clock size={20} className="shrink-0" />
              <span>{market.timezone_note}</span>
            </p>
          )}
        </div>
      </section>

      {market.hero_intro && (
        <section className="section-padding bg-background">
          <div
            className="container-custom prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: market.hero_intro }}
          />
        </section>
      )}

      {market.services_offered.length > 0 && (
        <section className="section-padding bg-muted">
          <div className="container-custom space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Services for {market.country_name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {market.services_offered.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <Card className="card-hover border-0 shadow-large h-full">
                    <CardContent className="p-6 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground">
                        {service.title}
                      </h3>
                      <ArrowRight size={20} className="text-primary shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {market.regional_portfolio.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Relevant case studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {market.regional_portfolio.map((item) => (
                <Card key={item.id} className="border-0 shadow-large h-full">
                  <CardContent className="p-6 space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {market.regional_testimonials.length > 0 && (
        <section className="section-padding bg-muted">
          <div className="container-custom space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              What clients say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {market.regional_testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-0 shadow-large h-full">
                  <CardContent className="p-6 space-y-4">
                    <Quote size={24} className="text-primary" />
                    <p className="text-muted-foreground leading-relaxed">
                      {testimonial.text}
                    </p>
                    <p className="font-semibold text-foreground">
                      {testimonial.author_name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-background">
        <div className="container-custom text-center">
          <Link href="/markets" className="text-primary font-medium">
            &larr; All markets we serve
          </Link>
        </div>
      </section>
    </>
  );
}