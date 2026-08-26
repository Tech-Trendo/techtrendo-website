import { API_URL } from "@/lib/api";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Globe2,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Hotel,
  Truck,
  Newspaper,
  Zap,
  Landmark,
  Users,
} from "lucide-react";
import ServicesClient from "@/components/client/ServicesClient";
import ServicesHeroCTA from "@/components/client/ServicesHeroCTA";
import ServiceCardActions from "@/components/client/ServiceCardActions";
import Link from "next/link";
import { seoData } from "@/types";
import { Metadata } from "next";
import {
  breadcrumbLd,
  faqLd,
  seoMetadata,
  serviceLd,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

// Define type for service object
interface ServiceFeature {
  title?: string;
  description?: string;
}
interface Service {
  id: number;
  slug: string;
  icon: string; // string from API
  title: string;
  short_description: string;
  long_description?: string;
  features: string[] | ServiceFeature[];
}

// Countries/regions the organization actually serves (mirrors organizationLd
// in lib/seo.ts — keep in sync when market pages are added).
const GLOBAL_AREAS = [
  "Nepal",
  "Australia",
  "India",
  "United Arab Emirates",
  "New Zealand",
];

// Route-level ISR fallback for the services hub.
export const revalidate = 3600;

const GLOBAL_META_TITLE =
  "Custom Software Development & IT Services | Tech Trendo";
const GLOBAL_META_DESCRIPTION =
  "Global software development company delivering custom software, web apps, mobile apps, cloud solutions, and IT outsourcing services to businesses worldwide.";

const faqs = [
  {
    question: "How do you work with clients in different time zones?",
    answer:
      "We run a distributed, async-friendly delivery process. Milestones, progress updates, and decisions are tracked in shared project management tools, with scheduled overlap calls that fit your working hours. Clients in Australia, India, the UAE, and New Zealand routinely coordinate with us without friction.",
  },
  {
    question: "What engagement models do you offer?",
    answer:
      "We offer fixed-scope projects for well-defined deliverables, dedicated development teams for ongoing product work, and time-and-materials engagements for evolving requirements. We'll recommend the model that fits your budget, timeline, and level of product uncertainty.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines are phase-based rather than fixed dates. A standard web or mobile application typically runs through discovery (1-2 weeks), planning, development sprints, and a testing and delivery phase. You receive a phase-by-phase schedule with clear milestones at kickoff, and we agree on the final timeline before development begins.",
  },
  {
    question: "What technologies and tools does your team use?",
    answer:
      "Our stack spans modern frontend frameworks (React, Next.js), backend platforms (Python/Django, Node.js), mobile development (React Native, Flutter), and cloud infrastructure (AWS, DigitalOcean). We select the stack based on your product's requirements, team availability, and long-term maintainability rather than a one-size-fits-all template.",
  },
  {
    question: "How do you ensure quality and security?",
    answer:
      "Quality is enforced through code review, automated testing, and a staging environment that mirrors production before any release. Security follows industry-standard practices: secure authentication, encrypted data handling, regular dependency updates, and compliance with data protection regulations that apply to your market.",
  },
  {
    question: "How does a project kick off with Tech Trendo?",
    answer:
      "Every project starts with a free discovery consultation. We discuss your goals, map the requirements, and deliver a proposal with scope, milestones, and team composition. Once agreed, you're introduced to your dedicated project manager and development team, and we begin with a structured planning phase before a single line of code is written.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      `${API_URL}/pages/service`,
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
    "/services",
    GLOBAL_META_TITLE,
    GLOBAL_META_DESCRIPTION,
  );
}
async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services/`, {
      next: { revalidate: 3600, tags: ["service"] }, // Revalidate every hour (ISR) + on-demand
    });
    if (!res.ok) return [];

    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}
export default async function Services() {
  let services: Service[] = [];
  services = await fetchServices();

  const industries = [
    {
      icon: ShoppingBag,
      name: "E-Commerce & Retail",
      description: "Online stores, order systems, and customer experiences that convert.",
    },
    {
      icon: GraduationCap,
      name: "Education & EdTech",
      description: "Learning platforms, admissions systems, and campus management tools.",
    },
    {
      icon: Stethoscope,
      name: "Healthcare",
      description: "Clinic systems, patient portals, and secure health data handling.",
    },
    {
      icon: Hotel,
      name: "Hospitality",
      description: "Hotel and restaurant websites, booking flows, and guest experiences.",
    },
    {
      icon: Truck,
      name: "Logistics & Transportation",
      description: "Fleet and delivery tracking, booking platforms, and operational dashboards.",
    },
    {
      icon: Newspaper,
      name: "Media & Publishing",
      description: "Content platforms, news portals, and audience growth systems.",
    },
    {
      icon: Zap,
      name: "Energy & Utilities",
      description: "Billing systems, monitoring tools, and customer service portals.",
    },
    {
      icon: Landmark,
      name: "Finance & Professional Services",
      description: "Secure portals, accounting tools, and client management systems.",
    },
    {
      icon: Users,
      name: "Non-Profit & Community",
      description: "Member management, donation flows, and community platforms.",
    },
  ];

  return (
    <div className="flex flex-col">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Our Services</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Software development and IT services for businesses worldwide
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            From custom software and web applications to mobile apps, cloud
            solutions, and IT outsourcing — we build, scale, and support the
            technology your business runs on.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-white/90">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Globe2 size={16} /> Serving clients in {GLOBAL_AREAS.join(", ")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              Trusted by 25+ partner organizations
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <ServicesHeroCTA />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              What We <span className="gradient-text">Deliver</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              One partner for your entire technology roadmap — from first
              prototype to long-term support.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service) => {
              // Dynamically pick icon from LucideIcons
              const IconComponent =
                (LucideIcons as unknown as Record<string, LucideIcon>)[
                  service.icon
                ] || LucideIcons.Code;
              return (
                <Card
                  key={service.id}
                  className="card-hover border-0 shadow-large"
                >
                  <JsonLd
                    data={serviceLd({
                      name: service.title,
                      description:
                        service.long_description || service.short_description,
                      url: `https://techtrendo.com/services/${service.slug}`,
                      areaServed: GLOBAL_AREAS,
                    })}
                  />
                  <CardContent className="p-8 space-y-6">
                    {/* Service Header */}
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <IconComponent className="text-white" size={32} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        What&apos;s Included:
                      </h4>
                      <ul className="space-y-2">
                        {service.features?.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center space-x-2 text-muted-foreground"
                          >
                            <ArrowRight
                              className="text-primary shrink-0"
                              size={16}
                            />
                            <span>
                              {typeof feature === "string"
                                ? feature
                                : feature.title || feature.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                     {/* Buttons */}
                     <ServiceCardActions serviceId={service.id} serviceSlug={service.slug} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Industries We <span className="gradient-text">Serve</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Domain-aware teams that understand your business — not just your
              tech stack. Learn how we approach{" "}
              <Link href="/markets" className="text-primary hover:underline">
                markets across the globe
              </Link>
              .
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, idx) => (
              <Card key={idx} className="card-hover bg-white border-0 shadow-large">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <industry.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {industry.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {industry.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We follow a proven methodology to ensure successful project
              delivery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
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
            ].map((phase, idx) => (
              <Card key={idx} className="card-hover bg-white text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
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
          <div className="text-center mt-12">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We&apos;re a{" "}
              <Link href="/about" className="text-primary hover:underline">
                software development company
              </Link>{" "}
              built for long-term partnerships — the same team that ships your
              first release stays with you through maintenance, scaling, and
              your next product. Read about our approach on the{" "}
              <Link href="/blog" className="text-primary hover:underline">
                Tech Trendo blog
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted">
        <JsonLd data={faqLd(faqs)} />
        <div className="container-custom max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Answers to the questions businesses ask us most before starting a
              project.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="card-hover bg-white border-0 shadow-large">
                <CardContent className="p-8 space-y-3">
                  <h3 className="text-xl font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* client component separated */}
      <ServicesClient />
    </div>
  );
}