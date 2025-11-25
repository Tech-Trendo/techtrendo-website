"use client";

import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceQuote from "@/components/ServiceQuote";

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

const Products: React.FC = () => {
   const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://app.techtrendo.com/api/app/products/");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg font-medium text-slate-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Our Products</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover innovative SaaS solutions designed to streamline your business operations and fuel growth.
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
                <p className="text-sm font-medium text-primary">{product.category}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-slate-600 text-base leading-relaxed">{product.short_description}</p>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Key Features</h4>
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
                  <Button
                    size="lg"
                    className="flex-1 bg-linear-to-r from-primary to-secondary text-white"
                    onClick={() => window.open(product.link || "#", "_blank")}
                  >
                    <ExternalLink className="mr-2" size={18} />
                    View Demo
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/products/${product.slug}`)}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Let’s discuss how our products can help you streamline operations and accelerate growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-linear-to-r from-primary to-secondary text-white">
                Contact Sales Team
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setQuoteOpen(true)}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Service Quote Modal */}
      {quoteOpen && (
        <ServiceQuote
          preselectedService={undefined} // Optional: pass default service if needed
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;
