import { API_URL } from "@/lib/api";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ServicesClient from "@/components/client/ServicesClient";
import Link from "next/link";
import { seoData } from "@/types";
import { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

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
export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      `${API_URL}/pages/service`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return seoMetadata(
    data,
    "/services",
    "IT Services | Web, App & Software Development by Tech Trendo Nepal",
    "Explore Tech Trendo's complete range of IT services — web design & development, mobile app development, software development, digital marketing, graphic design and ICT media services.",
  );
}
async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services/`, {
      next: { revalidate: 3600 }, // Revalidate every hour (ISR)
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
  // Scroll to top on mount
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Our Services</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Comprehensive IT solutions to drive your business forward
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* <p className="text-center text-muted-foreground">
            Loading services...
          </p> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service) => {
              // Dynamically pick icon from LucideIcons
              const IconComponent =
                (LucideIcons as any)[service.icon] || LucideIcons.Code;
              return (
                <Card
                  key={service.id}
                  className="card-hover border-0 shadow-large"
                >
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
                        What's Included:
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
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <Link href={`/quote?serviceId=${service.id}`} className="flex-1 w-full">
                        <Button className="btn-gradient w-full">
                          Get Quote <ArrowRight className="ml-2" size={16} />
                        </Button>
                      </Link>
                      <Link href={`/services/${service.slug}`} className="flex-1 w-full">
                        <Button
                          variant="outline"
                          className="btn-outline-gradient w-full"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-muted">
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
        </div>
      </section>
      {/* client component separated */}
      <ServicesClient />
    </div>
  );
}
