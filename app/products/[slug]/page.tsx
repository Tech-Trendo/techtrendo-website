"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Box,
  Icon as LucideIcon,
} from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import ServiceQuote from "@/components/ServiceQuote"; // ServiceQuote modal

// --- Type Definitions ---
interface ProductFeature {
  title: string;
  description: string;
}

interface ProductData {
  id: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  slug: string;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
  title: string;
  category: string;
  description: string;
  image: string | null;
  icon: string;
  link: string | null;
  features: ProductFeature[];
  KeyBenefits: string[];
  usecase: string[];
  short_description: string | null;
}

// Icon map (default to Box)
const iconMap: { [key: string]: typeof LucideIcon } = { Box };

// Fallback arrays
const fallbackBenefits = [
  "Drives competitive advantage",
  "Ensures better return on investment (ROI)",
  "Provides scalable and future-proof solutions",
  "Guarantees operational efficiency and speed",
];

const dummyUseCases = [
  "Marketing Team Efficiency",
  "Sales Automation",
  "HR & Recruitment Management",
  "Customer Support Optimization",
];

const API_BASE_URL = "https://app.techtrendo.com/api/app/products";

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const navigate = (path: string) => {
    router.push(path);
  };

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("No product identifier provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ProductData>(
          `${API_BASE_URL}/${slug}/`
        );
        setProduct(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("The requested product was not found (404).");
        } else {
          console.error(err);
          setError("An unknown error occurred while loading the product.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const IconComponent = product?.icon ? iconMap[product.icon] || Box : Box;

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-16">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8 max-w-lg bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-600">
            {error?.includes("not found")
              ? "Product Not Found"
              : "Loading Error"}
          </h1>
          <p className="text-muted-foreground">
            {error || "The product data could not be loaded."}
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="btn-gradient"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const data = product;

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        {/* SEO */}
        <Helmet>
          <title>{data.meta_title || `${data.title} - Product`}</title>
          <meta
            name="description"
            content={data.meta_description || data.description}
          />
          {data.meta_keywords && (
            <meta name="keywords" content={data.meta_keywords} />
          )}
          {data.canonical_url && (
            <link rel="canonical" href={data.canonical_url} />
          )}
          <meta property="og:title" content={data.og_title || data.title} />
          <meta
            property="og:description"
            content={data.og_description || data.description}
          />
          {data.og_image && (
            <meta property="og:image" content={data.og_image} />
          )}
        </Helmet>

        {/* Hero */}
        <section className="py-20 md:py-32 bg-linear-to-br from-primary via-secondary to-accent text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/products">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-8"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Products
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <div className="w-24 h-24 rounded-2xl shadow-lg overflow-hidden bg-white/10 group">
                  <img
                    src={product.icon}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-xl md:text-2xl text-white/70">
                  {data.category}
                </h2>
                <h1 className="text-4xl md:text-6xl font-bold">{data.title}</h1>
                <p className="text-lg md:text-xl text-white/90">
                  {data.short_description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Image & Overview */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {data.image && (
              <div className="w-full h-96 rounded-xl overflow-hidden">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                About the Product
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </section>

        {/* Key Benefits + Use Cases */}
        <section className="section-padding bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why <span className="gradient-text">Choose</span> This Product
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Key Benefits and Use Cases of using this product
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Key Benefits */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 gap-6">
                  {(data.KeyBenefits && data.KeyBenefits.length > 0
                    ? data.KeyBenefits
                    : fallbackBenefits
                  ).map((benefit, index) => (
                    <Card
                      key={index}
                      className="card-hover bg-linear-to-br from-primary/5 to-secondary/5 border-0"
                    >
                      <CardContent className="p-6 flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                          <CheckCircle2 className="text-white" size={16} />
                        </div>
                        <p className="text-foreground font-medium">{benefit}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Use Cases</h3>
                <div className="grid grid-cols-1 gap-6">
                  {(data.usecase && data.usecase.length > 0
                    ? data.usecase
                    : dummyUseCases
                  ).map((useCase, index) => (
                    <Card
                      key={index}
                      className="card-hover bg-linear-to-br from-primary/5 to-secondary/5 border-0"
                    >
                      <CardContent className="p-6 flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                          <CheckCircle2 className="text-white" size={16} />
                        </div>
                        <p className="text-foreground font-medium">{useCase}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {data.features && data.features.length > 0 && (
          <section className="py-20 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Product <span className="gradient-text">Features</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Key capabilities and features of this product
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.features.map((feature, index) => (
                  <Card key={index} className="card-hover bg-white">
                    <CardContent className="p-8 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {feature.title || `Feature ${index + 1}`}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description ||
                          "Detailed description coming soon."}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="section-padding bg-muted section-3d relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <div className="container-custom text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card className="card-3d border-0 max-w-4xl mx-auto bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
                <CardContent className="p-12 space-y-6">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold"
                  >
                    Interested in this Product?
                  </motion.h2>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xl max-w-2xl mx-auto opacity-90"
                  >
                    Get in touch to learn more or start using {data.title}.
                  </motion.p>
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white text-primary hover:bg-blue-500"
                      onClick={() => setQuoteOpen(true)}
                    >
                      Get Quote
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white bg-white/10 hover:bg-blue-500"
                      onClick={() => navigate("/products")}
                    >
                      View All Products
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* --- Service Quote Modal --- */}
        {quoteOpen && product && (
          <ServiceQuote
            preselectedProduct={product.id} // Pass current product ID
            onClose={() => setQuoteOpen(false)}
          />
        )}
      </div>
    </HelmetProvider>
  );
};

export default ProductDetail;
