import Link from "next/link";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsCTA from "@/components/client/ProductsCTA";
import { Metadata } from "next";
import { seoData } from "@/types";
interface ProductFeature {
  title: string;
  description: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  short_description: string;
  slug: string;
  category: string;
  icon: string | null;
  link: string | null;
  features: ProductFeature[];
}
export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      "https://app.techtrendo.com/api/app/pages/products",
      {
        next: { revalidate: 3600 },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return {
    title: data?.meta_title || "Products - TechTrendo",
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
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://app.techtrendo.com/api/app/products/", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}
export default async function Products() {
  const products = await fetchProducts().catch(() => []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Our Products</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover innovative SaaS solutions designed to streamline your
            business operations and fuel growth.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-background">
        <div className="container-custom grid gap-10 md:gap-12 md:grid-cols-2">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition duration-300"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg">
                  <div className="w-12 h-12 rounded-2xl shadow-lg overflow-hidden bg-white/10 group">
                    {product.icon && (
                      <img
                        src={product.icon}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {product.title}
                </CardTitle>
                <p className="text-sm font-medium text-primary">
                  {product.category}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-slate-600 text-base leading-relaxed">
                  {product.short_description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1 p-3 rounded-lg border border-slate-200 bg-slate-50"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="text-primary" size={18} />
                            <span className="font-medium text-slate-900 text-sm">
                              {feature.title || `Feature ${i + 1}`}
                            </span>
                          </div>
                          {/* <p className="text-xs text-slate-600 leading-relaxed">
                            {feature.description || "Detailed description coming soon."}
                          </p> */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={product.link ? product.link : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="flex-1 bg-linear-to-r from-primary to-secondary text-white"
                      // onClick={() => window.open(product.link || "#", "_blank")}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      View Demo
                    </Button>
                  </Link>
                  <Link href={`/products/${product.slug}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1"
                      // onClick={() => navigate(`/products/${product.slug}`)}
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <ProductsCTA />
    </div>
  );
}
