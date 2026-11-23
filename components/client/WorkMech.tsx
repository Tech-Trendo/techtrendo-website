"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Users, Workflow } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function WorkMech() {
  const workProcess = [
    {
      icon: Users,
      title: "Consultation",
      description:
        "We start by understanding your unique business needs and requirements.",
    },
    {
      icon: Target,
      title: "Strategy & Planning",
      description:
        "Our team creates a comprehensive strategy tailored to meet your business goals.",
    },
    {
      icon: Workflow,
      title: "Development",
      description:
        "We bring your vision to life with cutting-edge technology and best practices.",
    },
    {
      icon: CheckCircle,
      title: "Launch & Support",
      description:
        "After successful deployment, we provide ongoing support and maintenance.",
    },
  ];
  return (
    <div className="container-custom relative">
      <Reveal>
        <div className="text-center space-y-4 mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How <span className="gradient-text">Tech Trendo Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our proven 4-step process ensures successful project delivery and
            client satisfaction
          </p>
        </div>
      </Reveal>
      <div className="relative flex flex-col lg:flex-row items-stretch justify-between gap-8">
        {workProcess.map((step, index) => (
          <Reveal
            key={index}
            delay={index * 0.3}
            className="w-full lg:w-1/4"
          >
            <div className="relative flex flex-col items-center w-full h-full">
              {/* connector line - only show if not last step */}
              {index !== workProcess.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-full h-1 bg-linear-to-r from-primary to-secondary z-0 translate-x-1/2" />
              )}

              <Card className="card-3d border-0 bg-linear-to-br from-[#f0f7ff] to-[#f6f3fc] w-full h-full relative z-10">
                <CardContent className="p-8 text-center flex flex-col justify-between items-center space-y-4 h-full">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <step.icon className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
