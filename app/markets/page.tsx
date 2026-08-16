import { API_URL } from "@/lib/api";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { seoMetadata } from "@/lib/seo";
import { seoData } from "@/types";
import { MarketPageBrief } from "@/types";

const REVALIDATE = 3600;

async function fetchPublishedMarkets(): Promise<MarketPageBrief[]> {
  try {
    const res = await fetch(`${API_URL}/markets/`, {
      next: { revalidate: REVALIDATE, tags: ["market"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: MarketPageBrief[] = Array.isArray(data)
      ? data
      : data?.results ?? [];
    return list.filter((m) => m?.status === "published");
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(`${API_URL}/pages/markets`, {
      next: { revalidate: REVALIDATE, tags: ["page"] },
    });
    if (res.ok) data = await res.json();
  } catch {}
  return seoMetadata(
    data,
    "/markets",
    "Markets We Serve | Tech Trendo Software Development",
    "Tech Trendo serves clients across the United States, United Kingdom, India, Australia, the UAE and beyond with web, app and software development.",
  );
}

export default async function MarketsPage() {
  const markets = await fetchPublishedMarkets();

  return (
    <div className="flex flex-col">
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Markets We Serve</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Remote-first software development teams for clients worldwide
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          {markets.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Market pages are being prepared and will appear here once they
              are published.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {markets.map((market) => (
                <Link key={market.id} href={`/markets/${market.slug}`}>
                  <Card className="card-hover border-0 shadow-large h-full">
                    <CardContent className="p-8 space-y-4">
                      <h3 className="text-2xl font-bold text-foreground">
                        {market.country_name}
                      </h3>
                      {market.timezone_note && (
                        <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock size={16} className="text-primary shrink-0" />
                          <span>{market.timezone_note}</span>
                        </p>
                      )}
                      <p className="flex items-center space-x-2 text-primary font-medium">
                        <span>Learn more</span>
                        <ArrowRight size={16} />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}