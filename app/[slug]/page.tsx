"use client";
import axios from "axios";
import NotFound from "../not-found";
import { useEffect, useState } from "react";
interface Member {
  id: number;
  name: string;
  role: string;
  image: string | null;
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
  email: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
}

// import { cache } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { useParams } from "next/navigation";

const Team = () => {
  const params = useParams();
  const slug = params.slug;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchMember = async () => {
      try {
        const res = await axios.get(
          `https://app.techtrendo.com/api/app/members/${slug}/`
        );
        setMember(res.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [slug]);

  if (loading)
    return <p className="text-center mt-16 text-xl h-screen">Loading...</p>;
  if (!member) return <NotFound />;

  return (
    // <HelmetProvider>
    <div className="flex flex-col">
      {/* SEO Meta Tags */}
      {/* <Helmet>
          <title>{member.meta_title || member.name}</title>
          {member.meta_description && (
            <meta name="description" content={member.meta_description} />
          )}
          {member.meta_keywords && (
            <meta name="keywords" content={member.meta_keywords} />
          )}
          {member.canonical_url && (
            <link rel="canonical" href={member.canonical_url} />
          )}

          <meta property="og:title" content={member.og_title || member.name} />
          {member.og_description && (
            <meta property="og:description" content={member.og_description} />
          )}
          {member.og_image && (
            <meta property="og:image" content={member.og_image} />
          )}

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={member.twitter_title || member.name}
          />
          {member.twitter_description && (
            <meta
              name="twitter:description"
              content={member.twitter_description}
            />
          )}
          {member.twitter_image && (
            <meta name="twitter:image" content={member.twitter_image} />
          )}
        </Helmet> */}

      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white text-center">
        <div className="container-custom space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">{member.name}</h1>
          <p className="text-xl md:text-2xl text-white/90">{member.role}</p>
        </div>
      </section>

      {/* Member Details Card */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <Card className="shadow-2xl rounded-2xl p-8">
            <CardContent className="flex flex-col items-center space-y-8 text-center">
              {/* Square Image */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-5xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
              </div>

              {/* Member Info */}
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  {member.name}
                </h2>
                <p className="text-lg text-muted-foreground">{member.role}</p>
                {member.email && (
                  <p className="text-sm text-gray-500 mt-1">{member.email}</p>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-5 mt-2">
                {member.twitter && (
                  <a
                    href={`https://twitter.com/${member.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                {member.github && (
                  <a
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition"
                  >
                    <Github size={20} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    <Mail size={20} />
                  </a>
                )}
              </div>

              <Link href="/about">
                <Button variant="outline" className="mt-6">
                  ← Back to Team
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
    // </HelmetProvider>
  );
};
export default Team;
