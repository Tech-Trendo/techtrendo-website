import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users, Award, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, courseLd, countryAlternates } from "@/lib/seo";
export const metadata: Metadata = {
  title:
    "Tech Trendo Courses | Advanced Course Management System & eLearning Solutions",
  description:
    "Explore Tech Trendo’s Courses — featuring a powerful Course Management System (CMS) to manage, track, and deliver online courses efficiently. Designed for educational institutions, trainers, and learners in Nepal, Itahari, and globally.",
  keywords:
    "course management system Nepal, online courses Itahari, eLearning solutions Nepal, CMS software for schools, Tech Trendo courses, digital education platform, learning management system Nepal, online training software, educational software Nepal, remote learning solutions",
  alternates: countryAlternates(`${SITE_URL}/courses`),
  openGraph: {
    title: "Tech Trendo Courses | Advanced Course Management System & eLearning Solutions",
    description:
      "Explore Tech Trendo’s Courses — a powerful Course Management System to manage, track, and deliver online courses efficiently for institutions and learners in Nepal and globally.",
    url: `${SITE_URL}/courses`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/preview.png`,
        width: 1200,
        height: 630,
        alt: "Tech Trendo Courses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Trendo Courses | Advanced Course Management System",
    description:
      "Course Management System & eLearning solutions by Tech Trendo for institutions and learners in Nepal.",
    images: [`${SITE_URL}/preview.png`],
  },
};
const Courses: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience.",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Weekend and evening classes to fit your busy lifestyle.",
    },
    {
      icon: Award,
      title: "Certification",
      description:
        "Receive industry-recognized certificates upon course completion.",
    },
    {
      icon: BookOpen,
      title: "Practical Projects",
      description:
        "Work on real projects to build your portfolio and gain experience.",
    },
  ];

  return (
    <div className="flex flex-col">
      <JsonLd
        data={courseLd({
          name: "Tech Trendo IT Courses",
          description:
            "Industry-relevant IT courses in web development, mobile apps, software, and digital marketing with flexible schedules and industry-recognized certification.",
        })}
      />
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Our Courses</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Advance your career with industry-relevant IT courses
          </p>
        </div>
      </section>

      {/* Course Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why Choose <span className="gradient-text">Our Courses</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Coming Soon */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Available <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose from our comprehensive range of IT courses designed for all
              skill levels
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="card-hover bg-white max-w-md w-full shadow-lg">
              <CardContent className="p-12 flex flex-col items-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <ArrowRight className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground text-center">
                  Courses Coming Soon
                </h3>
                <p className="text-muted-foreground text-lg text-center">
                  We are preparing amazing courses for you! Stay tuned and check
                  back soon.
                </p>
                <Link href={"/contact"}>
                  <Button
                    variant="outline"
                    className="mt-4 border-primary text-primary hover:bg-primary/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Management Product */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                Our Course{" "}
                <span className="gradient-text">Management Product</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We&apos;ve developed a comprehensive course management system that
                helps educational institutions organize courses, manage
                subjects, create timetables, plan curriculum, and conduct
                examinations efficiently.
              </p>
              <div className="space-y-4">
                {[
                  "Course Organization & Management",
                  "Subject Planning & Tracking",
                  "Automated Timetable Generation",
                  "Curriculum Planning Tools",
                  "Exam Management System",
                  "Student Progress Monitoring",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                      <ArrowRight className="text-white" size={14} />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href={"/contact"}>
                <Button size="lg" className="btn-gradient">
                  Request Demo
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Institutions", value: "50+" },
                { title: "Students", value: "5000+" },
                { title: "Courses", value: "200+" },
                { title: "Success Rate", value: "95%" },
              ].map((stat, index) => (
                <Card key={index} className="card-hover text-center">
                  <CardContent className="p-6 space-y-2">
                    <div className="text-3xl font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">{stat.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-linear-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of students who have advanced their careers through
            our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/contact"}>
              <Button
                size="lg"
                className="group bg-white text-blue-600 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-xl"
              >
                <span className="font-semibold transition-colors duration-300 group-hover:text-white">
                  Contact Administration
                </span>
                <ArrowRight
                  className="ml-2 transition-colors duration-300 group-hover:text-white"
                  size={20}
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
