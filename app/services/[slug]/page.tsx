"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Palette,
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  Code,
  Icon as LucideIcon,
} from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import ServiceQuote from "@/components/ServiceQuote";

// --- Type Definitions ---
interface ServiceFeature {
  title?: string;
  description?: string;
}

interface ServiceData {
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
  short_description: string;
  long_description: string;
  icon: string;
  image: string | null;
  features: string[] | ServiceFeature[];
  keybenefits?: string[] | ServiceFeature[];
  tagline?: string;
}

// Internal Interface for Component State, including process & benefits
interface DisplayServiceData extends ServiceData {
  benefits: string[];
  process: { step: string; title: string; description: string }[];
}

// Map the icon string names from the API to the actual Lucide React components
const iconMap: { [key: string]: typeof LucideIcon } = {
  Palette: Palette,
  Globe: Globe,
  Smartphone: Smartphone,
  Monitor: Monitor,
  TrendingUp: TrendingUp,
  Code: Code,
};

// Placeholder logic for feature details
const getPlaceholderFeatureDetails = (featureTitle: string, index: number) => ({
  title: featureTitle,
  description: `Offering deep expertise in ${featureTitle.toLowerCase()} to deliver high-quality, tailored solutions.`,
  index: index + 1,
});

const API_BASE_URL = "https://app.techtrendo.com/api/app/services";

// Fallback process & benefits
const detailedFallbackProcess = [
  {
    step: "01",
    title: "Discovery",
    description:
      "Understanding your needs, goals, and requirements through detailed consultation.",
  },
  {
    step: "02",
    title: "Planning",
    description:
      "Creating a comprehensive project plan with timelines, milestones, and deliverables.",
  },
  {
    step: "03",
    title: "Development",
    description:
      "Building your solution using best practices and cutting-edge technologies.",
  },
  {
    step: "04",
    title: "Delivery",
    description:
      "Testing, refining, and delivering your project with ongoing support.",
  },
];

const fallbackBenefits = [
  "Drives competitive market advantage",
  "Ensures better return on investment (ROI)",
  "Provides scalable and future-proof solutions",
  "Guarantees operational efficiency and speed",
];

const ServiceDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const navigate = (path: string) => {
    router.push(path);
  };

  const [service, setService] = useState<DisplayServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null); // numeric ID

  // Fetch service detail
  useEffect(() => {
    if (!slug) {
      setError("No service identifier provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchServiceDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<ServiceData>(
          `${API_BASE_URL}/${slug}/`
        );
        const data = response.data;

        const processedData: DisplayServiceData = {
          ...data,
          tagline:
            data.tagline ||
            data.short_description ||
            `Detail-oriented ${data.title} for maximum impact.`,
          benefits:
            data.keybenefits && data.keybenefits.length > 0
              ? data.keybenefits.map((kb) =>
                  typeof kb === "string" ? kb : kb.title || kb.description || ""
                )
              : fallbackBenefits,
          process: detailedFallbackProcess.map((p) => ({
            step: p.step,
            title: p.title,
            description: p.description || "",
          })),
        };

        setService(processedData);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("The requested service was not found (404).");
        } else {
          console.error("Error fetching service detail:", err);
          setError("An unknown error occurred while loading the service.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [slug]);

  const IconComponent = useMemo(
    () => (service?.icon ? iconMap[service.icon] || Code : Code),
    [service]
  );

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-16">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-40 w-full rounded-xl bg-muted" />
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

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8 max-w-lg bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-600">
            {error?.includes("not found")
              ? "Service Not Found"
              : "Loading Error"}
          </h1>
          <p className="text-muted-foreground">
            {error || "The service data could not be loaded."}
          </p>
          <Button
            onClick={() => navigate("/services")}
            className="btn-gradient"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const data = service;

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>{data.meta_title || `${data.title} - Services`}</title>
          <meta
            name="description"
            content={data.meta_description || data.short_description}
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
            content={data.og_description || data.short_description}
          />
          {data.og_image && (
            <meta property="og:image" content={data.og_image} />
          )}
        </Helmet>

        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-secondary to-accent text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/services">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-8"
              >
                <ArrowLeft className="mr-2" size={16} /> Back to Services
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <IconComponent className="text-white" size={48} iconNode={[]} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold">{data.title}</h1>
                <p className="text-xl md:text-2xl text-white/90">
                  {data.tagline}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Service <span className="gradient-text">Overview</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {data.short_description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {data.long_description}
                </p>
              </div>

              <Card className="card-hover bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {data.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2
                          className="text-primary flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                What We <span className="gradient-text">Offer</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive features designed to meet your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.features.map((feature, index) => {
                const f =
                  typeof feature === "string"
                    ? getPlaceholderFeatureDetails(feature, index)
                    : feature;
                return (
                  <Card key={index} className="card-hover bg-white">
                    <CardContent className="p-8 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {f.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Our <span className="gradient-text">Process</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A streamlined approach to delivering excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.process.map((phase, index) => (
                <Card key={index} className="card-hover bg-white text-center">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {phase.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {phase.title}
                    </h3>
                    <p className="text-muted-foreground">{phase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
              <Card className="card-3d border-0 max-w-4xl mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
                <CardContent className="p-12 space-y-6">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold"
                  >
                    Want to Start Your Project?
                  </motion.h2>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xl max-w-2xl mx-auto opacity-90"
                  >
                    Let's discuss how our {data.title} services can help your
                    business grow.
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
                      onClick={() => {
                        setSelectedService(data.id); // FIX: pass numeric ID
                        setQuoteOpen(true);
                      }}
                    >
                      Get a Quote
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white bg-white/10 hover:bg-blue-500"
                      onClick={() => navigate("/services")}
                    >
                      View All Services
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Service Quote Modal */}
        {quoteOpen && selectedService !== null && (
          <ServiceQuote
            preselectedService={selectedService}
            onClose={() => setQuoteOpen(false)}
          />
        )}
      </div>
    </HelmetProvider>
  );
};

export default ServiceDetail;
