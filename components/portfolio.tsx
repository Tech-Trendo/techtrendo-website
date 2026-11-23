"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Reveal from "@/components/Reveal";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  type: "mobile_app" | "software" | "website";
  points?: string;
  link?: string;
}

const TAB_FILTERS = ["Mobile App", "Software", "Website"] as const;

const Portfolio = ({ projects }: { projects: Project[] }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Mobile App" | "Software" | "Website"
  >("Mobile App");

  const renderProjects = (projects: Project[]) => {
    if (projects.length === 0)
      return <p className="text-center">No projects found.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            delay={index * 0.15}
            className="h-full"
            y={40}
          >
            <Card className="card-3d bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
              {/* Square image container */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>

              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                {project.link && (
                  <Button
                    // size="sm"
                    className="mt-3 inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary"
                  >
                    View Project
                    <ArrowRight size={16} />
                  </Button>
                )}
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    );
  };

  const getProjectsByTab = () => {
    switch (activeTab) {
      case "Mobile App":
        return projects.filter((p) => p.type === "mobile_app");
      case "Software":
        return projects.filter((p) => p.type === "software");
      case "Website":
        return projects.filter((p) => p.type === "website");
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col">
      {/* Portfolio Section */}
      <section id="portfolio" className="section-padding bg-white section-3d">
        <div className="container-custom text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse projects across mobile apps, software, and web
            development.
          </p>
        </div>

        {/* Tabs */}
        <div className="container-custom">
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {TAB_FILTERS.map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "Mobile App" | "Software" | "Website")
                }
                className={`px-6 py-2 font-semibold rounded-lg transition ${
                  activeTab === tab
                    ? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
                    : "bg-white text-foreground border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {renderProjects(getProjectsByTab())}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted section-3d relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 blur-3xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 pointer-events-none" />

        <div className="container-custom text-center relative z-10">
          <Reveal>
            <Card className="card-3d relative z-10 border-0 max-w-4xl mx-auto bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 text-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]">
              <CardContent className="p-12 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Want to Start Your Project?
                </h2>
                <p className="text-xl max-w-2xl mx-auto opacity-90">
                  Let&apos;s bring your ideas to life. Connect with us and let&apos;s
                  build something amazing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    className="group bg-white text-blue-600 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:shadow-xl"
                    onClick={() => router.push("/contact")}
                  >
                    <span className="font-semibold transition-colors duration-300 group-hover:text-white">
                      Contact Us
                    </span>
                    <ArrowRight
                      size={20}
                      className="ml-2 transition-colors duration-300 group-hover:text-white"
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
