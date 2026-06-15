import { Users, Target, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";
import { seoData } from "@/types";
interface Member {
  id: number;
  slug: string;
  name: string;
  role: string;
  email: string;
  image: string | null;
}
export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch("https://app.techtrendo.com/api/app/pages/about", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return {
    title: data?.meta_title || "About us | Tech Trendo",
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
async function fetchTeamMembers(): Promise<Member[]> {
  try {
    const res = await fetch("https://app.techtrendo.com/api/app/members/", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}
export default async function About() {
  const teamMembers = await fetchTeamMembers().catch(() => []);
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description:
        "Continuously pushing boundaries with cutting-edge solutions and fresh perspectives.",
    },
    {
      icon: Heart,
      title: "Education Focus",
      description:
        "Committed to empowering the education sector with modern ICT solutions.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "Delivering exceptional quality in every project, no matter the size or complexity.",
    },
    {
      icon: Users,
      title: "Client Partnership",
      description:
        "Building long-term relationships based on trust, transparency, and mutual success.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        {/* <section className="section-padding card-gradient text-white"> */}
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">About Tech Trendo</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Leading the digital transformation in Eastern Nepal with innovative
            IT solutions
          </p>
        </div>
      </section>

      {/* What You Should Know About Us */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                What You Should{" "}
                <span className="gradient-text">Know About Us</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tech Trendo is a dynamic IT company based in Itahari City,
                  Eastern Nepal, founded by a team of young, passionate
                  innovators who believe in the transformative power of
                  technology.
                </p>
                <p>
                  Our journey began with a simple yet powerful vision: to bridge
                  the digital divide in Eastern Nepal by providing world-class
                  IT solutions that are both accessible and effective. We
                  specialize in serving the education sector, recognizing its
                  crucial role in shaping Nepal's future.
                </p>
                <p>
                  With our comprehensive suite of services ranging from web
                  development to digital marketing, we've become the trusted
                  partner for businesses, educational institutions, and
                  organizations looking to embrace digital transformation.
                </p>
                <p>
                  What sets us apart is our deep understanding of the local
                  market combined with global best practices. We don't just
                  deliver projects; we build lasting partnerships that drive
                  sustainable growth and success.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                      <value.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals driving Tech Trendo's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <Link key={member.slug} href={`/${member.slug}`}>
                  <Card className="card-hover bg-white">
                    <CardContent className="p-8 text-center space-y-6">
                      <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-2xl font-bold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-primary font-medium">
                          {member.role}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {member.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-3">
                No team members found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Card className="card-hover border-0 shadow-large">
              <CardContent className="p-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  Our Mission
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower businesses and educational institutions in Eastern
                  Nepal with innovative, accessible, and effective IT solutions
                  that drive digital transformation and sustainable growth.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-large">
              <CardContent className="p-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-secondary to-accent flex items-center justify-center">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  Our Vision
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To be the leading IT solutions provider in Nepal, recognized
                  for our innovation, quality, and commitment to bridging the
                  digital divide across all sectors of society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-linear-to-r from-primary to-secondary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">60+</div>
              <div className="text-white/90">Projects Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">50+</div>
              <div className="text-white/90">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">3</div>
              <div className="text-white/90">Years Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">24/7</div>
              <div className="text-white/90">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
