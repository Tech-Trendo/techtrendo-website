"use client";

import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  type: "mobile_app" | "software" | "website";
  points?: string;
  link?: string;
}

const Portfolio = () => {
   const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Mobile App" | "Software" | "Website">(
    "Mobile App"
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://app.techtrendo.com/api/app/portfolio/");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const renderProjects = (projects: Project[]) => {
    if (loading) return <p className="text-center">Loading...</p>;
    if (projects.length === 0) return <p className="text-center">No projects found.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <Card className="card-3d bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
              {/* Square image container */}
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>

              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
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
          </motion.div>
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
      <section className="section-padding bg-white section-3d">
        <div className="container-custom text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our diverse projects across mobile apps, software, and web development.
          </p>
        </div>

        {/* Tabs */}
        <div className="container-custom">
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {["Mobile App", "Software", "Website"].map((tab) => (
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
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="card-3d border-0 max-w-4xl mx-auto bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
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
                  Let's bring your ideas to life. Connect with us and let's build
                  something amazing together.
                </motion.p>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                >
                <Button
  // size="lg"
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
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
