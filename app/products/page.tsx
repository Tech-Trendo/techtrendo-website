import { API_URL } from "@/lib/api";
import Link from "next/link";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsCTA from "@/components/client/ProductsCTA";
import { Metadata } from "next";
import { seoData } from "@/types";
import { seoMetadata } from "@/lib/seo";
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
      `${API_URL}/pages/products`,
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
    "/products",
    "Products | Software Solutions by Tech Trendo",
    "Explore Tech Trendo's software products — School Management System, Business Management System, Cooperative Management System, and more.",
  );
}
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products/`, {
      next: { revalidate: 3600, tags: ["product"] },
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
        <div className="container-custom grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition duration-300"
            >
              <div className="relative h-56 bg-linear-to-b from-slate-50 to-slate-100 flex items-center justify-center p-8 overflow-hidden border-b border-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {product.icon && (
                  <div className="absolute top-4 left-4 h-12 w-12 rounded-xl bg-white/85 backdrop-blur-md border border-white/50 shadow-md p-2 overflow-hidden z-20 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={product.icon}
                      alt={`${product.title} icon`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {product.title}
                </CardTitle>
                <p className="text-sm font-medium text-primary">
                  {product.category}
                </p>
              </CardHeader>

              <CardContent className="space-y-6 pb-8">
                <p className="text-slate-600 text-base leading-relaxed">
                  {product.short_description}
                </p>

                 {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {product.features.slice(0, 6).map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-slate-700 text-sm"
                        >
                          <CheckCircle className="text-primary shrink-0" size={16} />
                          <span className="font-medium text-slate-800">
                            {feature.title || `Feature ${i + 1}`}
                          </span>
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
                    className="flex-1 w-full"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-linear-to-r from-primary to-secondary text-white"
                    >
                      <ExternalLink className="mr-2" size={18} />
                      View Demo
                    </Button>
                  </Link>
                  <Link href={`/products/${product.slug}`} className="flex-1 w-full">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
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
