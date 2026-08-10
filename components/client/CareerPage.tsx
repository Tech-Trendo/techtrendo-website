"use client";
import { API_URL } from "@/lib/api";

import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Clock, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Application from "@/components/application";
import SendResume from "@/components/SendResume";

interface Position {
  id: number;
  title: string;
  location: string;
  type: "Internship" | "Employment";
  duration: string | null;
  description: string;
  requirements: string[];
  qualifications: string;
  img?: string | null;
  deadline?: string | null;
}

interface RawPosition {
  id: number;
  title: string;
  location?: string | null;
  duration?: string | null;
  description?: string | null;
  requirements?: string[] | null;
  qualifications?: string | null;
  img?: string | null;
  deadline?: string | null;
}

const formatDate = (dateString: string | null): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Careers = () => {
  const [activeTab, setActiveTab] = useState<"Internship" | "Employment">("Internship");
  const [internships, setInternships] = useState<Position[]>([]);
  const [fullTimePositions, setFullTimePositions] = useState<Position[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [applicationType, setApplicationType] = useState<"job" | "intern">("intern");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showResumePopup, setShowResumePopup] = useState(false);

  const handleOpenPopup = () => setShowResumePopup(true);
  const handleClosePopup = () => setShowResumePopup(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const internRes = await fetch(`${API_URL}/interns/`);
        const internData: RawPosition[] = await internRes.json();
        setInternships(
          internData.map((pos) => ({
            id: pos.id,
            title: pos.title,
            location: pos.location || "Not specified",
            type: "Internship",
            duration: pos.duration || "Not specified",
            description: pos.description || "",
            requirements: pos.requirements || [],
            qualifications: pos.qualifications || "",
            img: pos.img,
            deadline: formatDate(pos.deadline ?? null),
          }))
        );

        const jobRes = await fetch(`${API_URL}/jobs/`);
        const jobData: RawPosition[] = await jobRes.json();
        setFullTimePositions(
          jobData.map((pos) => ({
            id: pos.id,
            title: pos.title,
            location: pos.location || "Not specified",
            type: "Employment",
            duration: pos.duration || "Not specified",
            description: pos.description || "",
            requirements: pos.requirements || [],
            qualifications: pos.qualifications || "",
            img: pos.img,
            deadline: formatDate(pos.deadline ?? null),
          }))
        );
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, []);

  const benefits = [
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Work with a passionate team of young innovators in a supportive atmosphere.",
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      description: "Access to training, courses, and conferences to keep your skills sharp.",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work-life balance with flexible working hours and remote work options.",
    },
    {
      icon: ArrowRight,
      title: "Career Growth",
      description: "Clear career progression paths and opportunities for advancement.",
    },
  ];

  const values = [
    "Innovation and creativity in everything we do",
    "Continuous learning and professional development",
    "Collaborative teamwork and knowledge sharing",
    "Quality excellence in all our deliverables",
    "Client satisfaction and long-term partnerships",
    "Social responsibility and community impact",
  ];

  const renderPositions = (positions: Position[]) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {positions.map((position) => (
        <Card key={position.id} className="card-hover bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-foreground">{position.title}</h3>
                <Badge variant={position.type === "Internship" ? "secondary" : "default"}>
                  {position.type}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{position.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{position.duration}</span>
                </div>
                {position.deadline && (
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">Deadline:</span>
                    <span>{position.deadline}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{position.description}</p>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Requirements:</h4>
              {position.requirements.length ? (
                <ul className="space-y-2">
                  {position.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-sm text-muted-foreground"
                    >
                      <ArrowRight className="text-primary shrink-0 mt-0.5" size={14} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific requirements listed.</p>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Qualifications:</strong> {position.qualifications || "Not specified"}
              </p>
            </div>

            <Button
              className="btn-gradient w-full"
              onClick={() => {
                setApplicationType(position.type === "Employment" ? "job" : "intern");
                setSelectedId(position.id);
                setModalOpen(true);
              }}
            >
              Apply Now
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Shape the Future with Tech Trendo</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Join our innovative team and be part of Nepal&apos;s digital transformation
          </p>
        </div>
      </section>

      {/* Company Culture */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                Why Work <span className="gradient-text">With Us?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                At Tech Trendo, we believe that our people are our greatest asset. We foster a culture of
                innovation, collaboration, and continuous learning where every team member can thrive and
                make a meaningful impact.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As a young, dynamic company, we offer unique opportunities to work on cutting-edge projects,
                learn from industry experts, and contribute to the digital transformation of Eastern Nepal.
              </p>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Our Values:</h3>
                <div className="space-y-2">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <ArrowRight className="text-primary shrink-0" size={16} />
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                      <benefit.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs for Positions */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Open <span className="gradient-text">Positions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the type of opportunity you are looking for
            </p>
          </div>

          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setActiveTab("Internship")}
              className={`px-6 py-2 font-semibold rounded-lg transition ${
                activeTab === "Internship"
                  ? "bg-linear-to-r from-primary to-secondary text-white"
                  : "bg-white text-foreground border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Internships
            </button>
            <button
              onClick={() => setActiveTab("Employment")}
              className={`px-6 py-2 font-semibold rounded-lg transition ${
                activeTab === "Employment"
                  ? "bg-linear-to-r from-primary to-secondary text-white"
                  : "bg-white text-foreground border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Full-time
            </button>
          </div>

          {activeTab === "Internship" && renderPositions(internships)}
          {activeTab === "Employment" && renderPositions(fullTimePositions)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-linear-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Don&apos;t See a Perfect Match?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals. Send us your resume and let&apos;s discuss opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleOpenPopup}
              size="lg"
              variant="outline"
className="bg-white text-primary hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Send Resume
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Send Resume Popup */}
      {showResumePopup && <SendResume onClose={handleClosePopup} isOpen={showResumePopup} />}

      {/* Application Modal */}
      {modalOpen && selectedId && (
        <Application type={applicationType} id={selectedId} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Careers;
