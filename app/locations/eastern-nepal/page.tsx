import { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Globe,
  Building2,
  Users,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, seoMetadata, breadcrumbLd, faqLd } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";
import { seoData } from "@/types";
import { API_URL } from "@/lib/api";

const LOCAL_PAGE_PATH = "/locations/eastern-nepal";

const FAQS: FaqItem[] = [
  {
    question: "What areas of Eastern Nepal does Tech Trendo serve?",
    answer:
      "We serve the whole of Eastern Nepal from our office in Sundarharaincha, Morang (near Itahari) — including Itahari, Biratnagar, Dharan, Inaruwa, Damak, Birtamode, and surrounding areas across Morang, Sunsari, and Jhapa districts. For clients further out, we deliver remotely and travel for on-site work when needed.",
  },
  {
    question: "Does Tech Trendo only work with clients in Eastern Nepal?",
    answer:
      "No — our team serves clients across Nepal and internationally, and we regularly work on remote-first projects. But Eastern Nepal is where we're based and where we can offer in-person meetings, on-site support, and face-to-face collaboration.",
  },
  {
    question: "Can we meet your team in person?",
    answer:
      "Yes. Our office is in Sundarharaincha, Morang (near Itahari), and we're available for in-person consultations by appointment. For clients in Biratnagar, Dharan, and the surrounding areas, we also offer on-site visits to discuss requirements, review progress, and launch projects.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on the scope. Simple websites are usually delivered in a few weeks, while mobile apps and custom software can take several months. Before we start, you'll get a clear timeline with milestones so you know exactly what to expect and when.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Every project is different, so we quote based on your specific requirements rather than publishing fixed prices. Reach out for a free consultation — we'll discuss your goals and share a detailed, no-obligation quote.",
  },
];

const AREAS = [
  "Itahari",
  "Biratnagar",
  "Dharan",
  "Sundarharaincha",
  "Inaruwa",
  "Damak",
  "Birtamode",
  "Urlabari",
  "Jhapa",
  "Morang",
  "Sunsari",
];

const TESTIMONIALS = [
  {
    name: "Binu Kumar Baral",
    role: "CEO at Kathmandu NDT",
    text: "Working with Tech Trendo for our website development was a smooth and professional experience. Their team understood our technical requirements perfectly and delivered a modern, responsive website that truly represents our brand. We're very satisfied with their quality and attention to detail.",
  },
  {
    name: "Bodha Raj Nepal",
    role: "Principal at Sushma Godawari",
    text: "Tech Trendo has been handling our digital marketing for the past two years, and their consistent efforts have made a visible impact on our college's online presence. Their creative campaigns, content strategy, and social media management have helped us connect better with students and the community. Highly recommended for long-term collaborations.",
  },
  {
    name: "JP Prasain",
    role: "MD at Hotel Bella Cafe",
    text: "Tech Trendo handled both our website development and digital marketing, delivering excellent results. The website is modern and responsive, and their marketing strategies have helped boost our visibility and customer reach. A dependable and talented team to work with.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(`${API_URL}/pages/locations-eastern-nepal`, {
      next: { revalidate: 3600, tags: ["page"] },
    });
    if (res.ok) data = await res.json();
  } catch {}
  return seoMetadata(
    data,
    LOCAL_PAGE_PATH,
    "Best IT Company in Eastern Nepal | Tech Trendo",
    "Tech Trendo is a leading IT company in Eastern Nepal, serving Itahari, Biratnagar, Dharan and nearby cities with web, app, software, and marketing services.",
  );
}

export default async function EasternNepalPage() {
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}${LOCAL_PAGE_PATH}#localbusiness`,
    name: "Tech Trendo",
    url: `${SITE_URL}${LOCAL_PAGE_PATH}`,
    image: `${SITE_URL}/preview.png`,
    email: "info@techtrendo.com",
    telephone: "+977-9815602535",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sundarharaincha, Morang (Near Itahari)",
      addressLocality: "Sundarharaincha",
      addressRegion: "Koshi Pradesh",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.6599577,
      longitude: 87.2863306,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Itahari" },
      { "@type": "City", name: "Biratnagar" },
      { "@type": "City", name: "Dharan" },
      { "@type": "AdministrativeArea", name: "Morang" },
      { "@type": "AdministrativeArea", name: "Sunsari" },
      { "@type": "AdministrativeArea", name: "Jhapa" },
      { "@type": "Country", name: "Nepal" },
    ],
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    sameAs: [
      "https://www.facebook.com/techtrendo.np",
      "https://www.linkedin.com/company/tech-trendo/",
      "https://www.instagram.com/tech.trendo.np/",
    ],
  };

  const localServices = [
    {
      icon: Globe,
      title: "Web Design & Development",
      description:
        "Business websites, e-commerce stores, and web applications built and launched with in-person collaboration.",
    },
    {
      icon: Building2,
      title: "Software & Apps",
      description:
        "Custom software and mobile apps for local businesses, schools, cooperatives, and government agencies.",
    },
    {
      icon: Users,
      title: "Digital Marketing",
      description:
        "Local SEO, social media, and campaign management that put Eastern Nepal businesses in front of the right customers.",
    },
    {
      icon: ShieldCheck,
      title: "ICT & IT Support",
      description:
        "Setup, maintenance, and ongoing IT support for offices, schools, and institutions across the region.",
    },
  ];

  return (
    <div className="flex flex-col">
      <JsonLd data={localBusinessLd} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: "Eastern Nepal", path: LOCAL_PAGE_PATH },
        ])}
      />

      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Best IT Company in Eastern Nepal
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Your local technology partner for web development, mobile apps,
            software, and digital marketing — trusted by businesses across
            Itahari, Biratnagar, Dharan, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quote" prefetch={true}>
              <Button
                size="lg"
                className="btn-gradient text-base sm:text-lg px-8 py-5 sm:py-6 text-white"
              >
                Get a Free Local Consultation
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/services" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="btn-outline-gradient text-base sm:text-lg text-primary px-8 py-5 sm:py-6 border-white/40"
              >
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About the local presence */}
      <section className="section-padding bg-background section-3d">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                A Technology Team{" "}
                <span className="gradient-text">Rooted in Eastern Nepal</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Tech Trendo was founded in Itahari City, Eastern Nepal, by a
                  team of young, passionate innovators who believe in the
                  transformative power of technology — starting right here, in
                  our own community.
                </p>
                <p>
                  We work in both Nepali and English, meet clients face to face
                  when they want to, and understand the local business
                  landscape: from hospitality and education to cooperatives,
                  trade, and public institutions. When you work with us, you
                  talk directly to the people building your project — not a
                  call center.
                </p>
                <p>
                  Our aim is simple: real-time, effective IT solutions that
                  enhance your digital presence and operational efficiency,
                  delivered with the reliability of a team that is just a
                  phone call or a short drive away.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="card-hover border-0 shadow-large">
                <CardContent className="p-8 space-y-4">
                  <MapPin className="text-primary" size={32} />
                  <h3 className="text-xl font-bold text-foreground">
                    Office
                  </h3>
                  <p className="text-muted-foreground">
                    Sundarharaincha, Morang (Near Itahari), Koshi Pradesh,
                    Nepal
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover border-0 shadow-large">
                <CardContent className="p-8 space-y-4">
                  <MessageSquare className="text-primary" size={32} />
                  <h3 className="text-xl font-bold text-foreground">
                    In-Person Support
                  </h3>
                  <p className="text-muted-foreground">
                    Consultations by appointment, plus on-site visits for
                    projects across the region.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover border-0 shadow-large">
                <CardContent className="p-8 space-y-4">
                  <Clock className="text-primary" size={32} />
                  <h3 className="text-xl font-bold text-foreground">
                    24/7 Support
                  </h3>
                  <p className="text-muted-foreground">
                    Around-the-clock support available for your systems and
                    digital platforms.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover border-0 shadow-large">
                <CardContent className="p-8 space-y-4">
                  <Phone className="text-primary" size={32} />
                  <h3 className="text-xl font-bold text-foreground">
                    Contact
                  </h3>
                  <p className="text-muted-foreground">
                    +977-9815602535
                    <br />
                    info@techtrendo.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-muted section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Areas We <span className="gradient-text">Serve</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We deliver and support projects across Eastern Nepal — from
              face-to-face meetings to remote-first collaboration.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {AREAS.map((area) => (
              <span
                key={area}
                className="px-5 py-2.5 rounded-full bg-white border border-primary/15 text-foreground font-medium shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Local Services */}
      <section className="section-padding bg-background section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              What We Build <span className="gradient-text">for Local Clients</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The same full-service IT stack, delivered with local care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {localServices.map((service, index) => (
              <Card key={index} className="card-hover border-0 bg-white">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <service.icon className="text-white" size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" prefetch={true}>
              <Button
                size="lg"
                className="btn-gradient shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore All Services
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Local Proof */}
      <section className="section-padding bg-muted section-3d">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Trusted by Clients{" "}
              <span className="gradient-text">in Nepal</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from businesses we work with
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="card-hover bg-white border-0">
                <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                  <p className="text-foreground leading-relaxed italic">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {t.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <JsonLd data={faqLd(FAQS)} />
        <div className="container-custom max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              What local businesses usually want to know before starting a
              project.
            </p>
          </div>
          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
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

      {/* CTA */}
      <section className="section-padding bg-linear-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Let&apos;s Talk About Your Project
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Book a free consultation with our local team — in person or online.
            We&apos;ll listen to your goals and give you honest, practical
            advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quote" prefetch={true}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-8 py-5 sm:py-6"
              >
                Get a Free Local Consultation
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/contact" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 py-5 sm:py-6 text-white border-white/40"
              >
                <Mail className="mr-2" size={20} />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
