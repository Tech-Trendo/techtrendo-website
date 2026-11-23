import { API_URL } from "@/lib/api";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  BriefcaseBusiness,
  Workflow,
  Sparkles,
  BadgeDollarSign,
  Building2,
  Globe,
  Palette,
  Smartphone,
  MonitorCog,
  Megaphone,
  FileCode2,
  Code,
  TrendingUp,
  Monitor,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import AnimatedTechBackground from "@/components/AnimatedTechBackground";
import ChatFAB from "@/components/ChatFAB";
import Portfolio from "@/components/portfolio";
import CallToAction from "@/components/CallToAction";
import BlogSection, { type BlogPost } from "@/components/BlogSection";
import WorkMech from "@/components/client/WorkMech";
import HeroCTA from "@/components/client/HeroCTA";
import { Metadata } from "next";
import { countryAlternates } from "@/lib/seo";

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

// Only the handful of icons this site actually renders are registered here.
// Rendering the full lucide-react namespace pulled ~1,400 icon components into
// the server render; we map the known names and fall back to one icon.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "Palette": Palette,
  "Globe": Globe,
  "Smartphone": Smartphone,
  "Code": Code,
  "TrendingUp": TrendingUp,
  "Monitor": Monitor,
  "MonitorCog": MonitorCog,
  "Megaphone": Megaphone,
  "FileCode2": FileCode2,
  "ShieldCheck": ShieldCheck,
  "Cpu": Cpu,
  "Workflow": Workflow,
  "Sparkles": Sparkles,
  "BadgeDollarSign": BadgeDollarSign,
  "Building2": Building2,
  "BriefcaseBusiness": BriefcaseBusiness,
};

const getServiceIcon = (iconName?: string): LucideIcon =>
  (iconName && SERVICE_ICONS[iconName]) || FileCode2;

async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services/`, {
      next: { revalidate: 3600, tags: ["service"] },
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}


interface Review {
  id: number;
  reviewerName: string;
  reviewerRole: string;
  review: string;
  reviewerImage: string | null;
}

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

async function fetchFeaturedBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/?page_size=100`, {
      next: { revalidate: 3600, tags: ["blog"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = Array.isArray(data)
      ? data
      : data && Array.isArray(data.results)
        ? data.results
        : [];
    // Only keep the fields the blog cards render, so the RSC payload stays
    // small (the full CMS article bodies are never serialized for the homepage).
    return posts
      .filter((post: BlogPost) => post.is_featured)
      .map((post: BlogPost) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        image: post.image,
        pub_date: post.pub_date,
        is_featured: post.is_featured,
        meta_description: post.meta_description,
        og_description: post.og_description,
        excerpt: (
          (post.meta_description || post.og_description || "") as string
        )
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160),
      }));
  } catch {
    return [];
  }
}

interface PartnerLogo {
  id: number;
  name: string;
  image: string;
}

interface Gallery {
  id: number;
  title: string;
  image: string;
}
async function fetchReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/reviews/`, {
      next: { revalidate: 3600, tags: ["review"] },
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

async function fetchPartnerLogos(): Promise<PartnerLogo[]> {
  try {
    const res = await fetch(`${API_URL}/company-logos/`, {
      // ISR cache — `no-store` here forced the whole homepage route dynamic
      // (HTML served no-store, unstable TTFB). Keep consistent with the
      // other CMS fetches so the homepage stays statically renderable.
      next: { revalidate: 3600, tags: ["company-logo"] },
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}
async function fetchGallery(): Promise<Gallery[]> {
  try {
    const res = await fetch(
      `${API_URL}/gallery-items/`,
      {
        next: { revalidate: 3600, tags: ["gallery"] },
      },
    );
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data ?? [];
  } catch (error) {
    return [];
  }
}

export const metadata: Metadata = {
  title: {
    absolute: "Tech Trendo | Global Software Development & IT Services",
  },
  description:
    "Global software development company delivering custom software, web apps, mobile apps, cloud solutions, and IT outsourcing for businesses worldwide.",
  alternates: countryAlternates("https://techtrendo.com"),
  openGraph: {
    title: "Tech Trendo | Global Software Development & IT Services",
    description:
      "Global software development company delivering custom software, web apps, mobile apps, cloud solutions, and IT outsourcing services worldwide.",
    url: "https://techtrendo.com",
    siteName: "Tech Trendo",
    images: [
      {
        url: "https://techtrendo.com/preview.png",
        width: 1200,
        height: 630,
        alt: "Tech Trendo | Global Software Development & IT Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Trendo | Global Software Development & IT Services",
    description:
      "Web, App & Software Development + Digital Marketing services for businesses worldwide.",
    images: ["https://techtrendo.com/preview.png"],
  },
};
export default async function Home() {
  const [reviews, partnerLogos, gallery, services, portfolio, featuredBlogs] =
    await Promise.all([
      fetchReviews(),
      fetchPartnerLogos(),
      fetchGallery(),
      fetchServices(),
      fetchPortfolio(),
      fetchFeaturedBlogs(),
    ]).catch(
      (): [Review[], PartnerLogo[], Gallery[], Service[], Project[], BlogPost[]] =>
        [[], [], [], [], [], []],
    );
  const getInitials = (name: string) => {
    const words = name.split(" ");
    return words
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Comprehensive IT Services Suite",
      description:
        "Complete range of IT solutions from web development to digital marketing under one roof.",
    },
    {
      icon: Cpu,
      title: "Real-Time and Effective IT Solutions",
      description:
        "Quick response times and efficient solutions that deliver immediate business value.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Collaborative Partnerships",
      description:
        "We work closely with our clients to understand their needs and deliver customized solutions.",
    },
    {
      icon: Workflow,
      title: "Holistic IT Approach",
      description:
        "End-to-end solutions that cover all aspects of your digital transformation journey.",
    },
    {
      icon: Sparkles,
      title: "Youthful Innovation",
      description:
        "Fresh perspectives and innovative approaches brought by our young, dynamic team.",
    },
    {
      icon: BadgeDollarSign,
      title: "Cost-Effective Solutions",
      description:
        "High-quality services at competitive prices to maximize your return on investment.",
    },
  ];

  const fallbackServices = [
    {
      id: 1,
      slug: "graphic-design",
      icon: "Palette",
      title: "Graphic Design",
      short_description: "Creative visual solutions that capture your brand essence and communicate effectively.",
    },
    {
      id: 2,
      slug: "web-design-development",
      icon: "Globe",
      title: "Web Design & Development",
      short_description: "Modern, responsive websites that drive engagement and convert visitors to customers.",
    },
    {
      id: 3,
      slug: "app-design-development",
      icon: "Smartphone",
      title: "App Design & Development",
      short_description: "Native and cross-platform mobile applications with exceptional user experiences.",
    },
    {
      id: 4,
      slug: "ict-media-services",
      icon: "MonitorCog",
      title: "ICT/Media Services",
      short_description: "Comprehensive ICT solutions and media services for educational institutions.",
    },
    {
      id: 5,
      slug: "digital-marketing",
      icon: "Megaphone",
      title: "Digital Marketing",
      short_description: "Data-driven marketing strategies to grow your online presence and reach.",
    },
    {
      id: 6,
      slug: "software-development",
      icon: "FileCode2",
      title: "Software Development",
      short_description: "Custom software solutions tailored to your specific business requirements.",
    },
  ];

  const displayServices = (services && services.length > 0 ? services : fallbackServices).slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white text-gray-900 overflow-hidden py-12 sm:py-0">
        <AnimatedTechBackground />
        <div className="container-custom text-center space-y-6 sm:space-y-8 animate-fade-in-up z-10 px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight">
            Tech Trendo: Software Development
            <br />
            <span className="gradient-text block mt-1 sm:inline sm:mt-0">
              & IT Services for Businesses Worldwide
            </span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium max-w-3xl mx-auto text-black px-2">
            Your Trusted Technology Partner For Business Growth
          </p>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
            From custom software and web apps to cloud solutions and digital
            marketing, we deliver real-time, effective IT solutions that
            enhance digital presence and operational efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
            <HeroCTA />
          </div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 pt-2 text-sm sm:text-base font-medium text-gray-600">
            <span>60+ Projects Delivered</span>
            <span>50+ Happy Clients</span>
            <span>5 Countries Served</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Chat FAB */}
      <ChatFAB />

      {/* About Us Section */}
      <section className="section-padding bg-background section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              About <span className="gradient-text">Tech Trendo</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a global software development company dedicated to
              providing innovative digital solutions that transform businesses
              and drive growth. Our young, dynamic team combines creativity
              with technical expertise to deliver exceptional results for
              clients worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-3d border-0 bg-linear-to-br from-[#4c9aff]/5 to-[#7c3aed]/5">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full btn-gradient flex items-center justify-center mx-auto">
                  <Building2 className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Our Mission
                </h3>
                <p className="text-muted-foreground">
                  To provide real-time and effective IT solutions that enhance
                  digital presence and operational efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="card-3d border-0 bg-linear-to-br from-[#7c3aed]/5 to-[#0d9488]/5">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#7c3aed] to-[#0d9488] flex items-center justify-center mx-auto">
                  <Globe className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Our Vision
                </h3>
                <p className="text-muted-foreground">
                  To be the most trusted IT partner worldwide, driving digital
                  transformation across all industries.
                </p>
              </CardContent>
            </Card>

            <Card className="card-3d border-0 bg-linear-to-br from-[#0d9488]/5 to-[#4c9aff]/5">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#0d9488] to-[#4c9aff] flex items-center justify-center mx-auto">
                  <BriefcaseBusiness className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Our Team
                </h3>
                <p className="text-muted-foreground">
                  Young, passionate professionals committed to delivering
                  excellence in every project we undertake.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Amazing Features Section */}
      <section className="section-padding bg-muted section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Amazing <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover what makes Tech Trendo the preferred choice for
              businesses around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-3d border-0 bg-white">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-slate-50 to-blue-50 text-primary shadow-[0_12px_30px_rgba(37,99,235,0.12)]">
                    <feature.icon size={30} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Tech Trendo Works */}
      <section className="section-padding bg-background section-3d relative">
        <WorkMech />
      </section>

      {/* Our Services Overview */}
      <section className="section-padding bg-muted section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive IT solutions to drive your business forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => {
              const IconComponent = getServiceIcon(service.icon);
              return (
                <Card
                  key={service.id || index}
                  className="relative overflow-hidden card-3d bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="absolute top-2 right-2 z-20 w-8 h-8 btn-gradient rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <CardContent className="p-8 space-y-4 relative z-10">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-slate-50 to-blue-50 text-primary transition-transform duration-500 group-hover:scale-110 shadow-[0_12px_30px_rgba(37,99,235,0.12)]">
                      <IconComponent size={30} strokeWidth={2.2} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.short_description}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-all duration-300 hover:translate-x-1 p-0"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" prefetch={true}>
              <Button
                size="lg"
                className="btn-gradient shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Services
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <Portfolio projects={portfolio} />

      {/* Partners Section */}
      <section className="section-padding bg-background section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our <span className="gradient-text">Partners</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted collaborations that drive innovation and success
            </p>
          </div>

          {/* Partner Logos Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partnerLogos.length > 0 ? (
              partnerLogos.map((logo) => (
                <Card
                  key={logo.id}
                  className="card-3d border-0 bg-linear-to-br from-primary/5 to-secondary/5"
                >
                  <CardContent className="p-6 text-center space-y-4">
                    {/* next/image optimizer: CMS logo uploads can be huge
                        (multi-MB PNGs); the optimizer serves resized WebP. */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto shadow-lg">
                      <Image
                        src={logo.image}
                        alt={logo.name}
                        width={160}
                        height={160}
                        loading="lazy"
                        sizes="80px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {logo.name}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-full">
                No partner logos available.
              </p>
            )}
          </div>

          {/* Gallery Section */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item) => (
              <Card key={item.id} className="card-3d overflow-hidden border-0">
                  <CardContent className="p-8 text-center">
                    <div className="inline-block rounded-lg overflow-hidden shadow-lg bg-white">
                      <img
                        src={item.image}
                        alt={item.title}
                        width={160}
                        height={160}
                        loading="lazy"
                        decoding="async"
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                    <p className="mt-4 font-semibold text-foreground text-center whitespace-normal wrap-break-word">
                      {item.title}
                    </p>
                  </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Dynamic from API) */}

      <section className="section-padding bg-muted section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from satisfied clients
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="card-3d bg-white border-0"
                >
                  <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                    <p className="text-foreground leading-relaxed italic">
                      &quot;{testimonial.review}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      {testimonial.reviewerImage ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                          <img
                            src={testimonial.reviewerImage}
                            alt={testimonial.reviewerName}
                            width={48}
                            height={48}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                          {getInitials(testimonial.reviewerName)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.reviewerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.reviewerRole}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-3">
                No testimonials available.
              </p>
            )}
          </div>
        </div>
      </section>
      <BlogSection posts={featuredBlogs} />
      <CallToAction />
    </div>
  );
}
