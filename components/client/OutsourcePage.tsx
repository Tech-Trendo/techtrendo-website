"use client";
import { API_URL, RECAPTCHA_SITE_KEY as SITE_KEY } from "@/lib/api";

import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { 
  CheckCircle2, 
  Code, 
  Rocket, 
  Shield, 
  Users, 
  Zap, 
  Globe, 
  TrendingUp, 
  Award, 
  Send,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dynamicServiceQuote as ServiceQuote } from "@/components/dynamicServiceQuote";

interface ServiceFeature {
  title?: string;
  description?: string;
}

interface Service {
  id: number;
  slug: string;
  icon: string;
  title: string;
  short_description: string;
  long_description?: string;
  features: string[] | ServiceFeature[];
}

interface OutsourcePageProps {
  initialServices: Service[];
}

export default function OutsourcePage({ initialServices }: OutsourcePageProps) {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleCaptchaExpired = () => {
    setCaptchaValue(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Please verify that you are not a robot!");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch(
        `${API_URL}/contact/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, recaptcha_token: captchaValue }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(data.message || "Form submitted successfully!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
        setCaptchaValue(null);
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Unable to submit. Please check your network and try again.");
    }

    setLoading(false);
  };

  const benefits = [
    {
      icon: Users,
      title: "Expert Team",
      description: "Access to highly skilled developers, designers, and project managers with proven track records."
    },
    {
      icon: TrendingUp,
      title: "Cost Effective",
      description: "Competitive rates compared to in-house hiring while maintaining high-quality deliverables."
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Accelerated development cycles with our agile methodologies and dedicated teams."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Rigorous testing and quality control processes ensure bug-free, robust solutions."
    },
    {
      icon: Globe,
      title: "24/7 Support",
      description: "Round-the-clock availability across multiple time zones for continuous progress."
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Successfully delivered 60+ projects for clients across 5 countries."
    }
  ];

  const process = [
    { step: "01", title: "Discovery", description: "We understand your requirements and business goals through detailed consultation." },
    { step: "02", title: "Planning", description: "Create detailed roadmap, milestones, and select the right team for execution." },
    { step: "03", title: "Development", description: "Build your solution with regular updates, agile sprints, and visual demos." },
    { step: "04", title: "Deployment", description: "Launch your project with comprehensive testing, training, and full deployment support." },
    { step: "05", title: "Support", description: "Provide ongoing maintenance, performance optimization, and future feature enhancements." }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
            Outsource Your IT Projects to Expert Hands
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Partner with our talented team to build exceptional digital solutions. 
            From concept to deployment, we deliver excellence at every step.
          </p>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Outsource to <span className="gradient-text">Tech Trendo</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              We combine technical expertise, business acumen, and dedication to deliver 
              outstanding results that drive your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="card-3d border border-slate-100/50 bg-card pt-6 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 border border-primary/20 text-primary shadow-sm hover:scale-110 transition-transform duration-300 shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Services Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Comprehensive Outsourcing Services
            </h2>
            <p className="text-xl text-muted-foreground">
              End-to-end solutions tailored to your specific needs and industry requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {initialServices.map((service) => {
              const IconComponent =
                (LucideIcons as unknown as Record<string, LucideIcon>)[
                  service.icon
                ] || Code;
              return (
                <Card key={service.id} className="card-hover border border-slate-100 shadow-large hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 space-y-6">
                    {/* Service Header */}
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary shadow-sm hover:scale-110 transition-transform duration-300">
                        <IconComponent className="text-primary" size={32} />
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
                            <ArrowRight className="text-primary shrink-0" size={16} />
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
                       <Button
                         className="btn-gradient w-full"
                         onClick={() => {
                           setSelectedServiceId(service.id);
                           setQuoteOpen(true);
                         }}
                       >
                         Get Quote <ArrowRight className="ml-2" size={16} />
                       </Button>
                       <Link href={`/services/${service.slug}`} className="flex-1 w-full">
                         <Button variant="outline" className="btn-outline-gradient w-full">
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

      {/* Our Process Section */}
      <section className="section-padding bg-[#f0f2f5]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our Proven <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              A streamlined approach that ensures transparency, quality, and timely delivery.
            </p>
          </div>

          {/* Desktop Timeline (Visible on lg and above) */}
          <div className="hidden lg:block max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1e3a6e] transform -translate-x-1/2"></div>

              <div className="space-y-12">
                {process.map((item, index) => {
                  const isLeft = index % 2 === 0; // odd steps 01, 03, 05 are indexes 0, 2, 4 -> left
                  return (
                    <div key={index} className="grid grid-cols-[1fr_auto_1fr] gap-12 items-center relative">
                      {/* Left Column (Desktop Card for steps 01, 03, 05) */}
                      <div className={`flex justify-end ${isLeft ? "" : "pointer-events-none opacity-0"}`}>
                        {isLeft && (
                          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 max-w-md w-full text-right">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Center Column (Step circle) */}
                      <div className="flex justify-center z-10">
                        <div className="w-16 h-16 rounded-full bg-[#1e3a6e] flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                          {item.step}
                        </div>
                      </div>

                      {/* Right Column (Desktop Card for steps 02, 04) */}
                      <div className={`flex justify-start ${!isLeft ? "" : "pointer-events-none opacity-0"}`}>
                        {!isLeft && (
                          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 max-w-md w-full text-left">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Timeline (Visible below lg) */}
          <div className="lg:hidden max-w-lg mx-auto relative space-y-12">
            {/* Mobile Vertical Line */}
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-[#1e3a6e]"></div>

            {process.map((item, index) => (
              <div key={index} className="relative pl-16">
                {/* Mobile Step Circle */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1e3a6e] flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0 z-10">
                  {item.step}
                </div>
                {/* Mobile Card */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 text-left">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section â€” kept consistent with sitewide figures (homepage,
          /about): 60+ projects, 50+ clients, 5 countries, 24/7 support. */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold">60+</div>
              <div className="text-white/90 text-lg font-medium">Projects Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">50+</div>
              <div className="text-white/90 text-lg font-medium">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">5</div>
              <div className="text-white/90 text-lg font-medium">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">24/7</div>
              <div className="text-white/90 text-lg font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-section" className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Start Your Project Today
            </h2>
            <p className="text-xl text-muted-foreground">
              Fill out the form below and our team will get back to you within 24 hours to discuss your project requirements.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="card-hover bg-white shadow-large border-0">
              <CardContent className="p-8 space-y-6">
                {successMsg && (
                  <p className="text-green-600 font-medium text-center">{successMsg}</p>
                )}
                {errorMsg && (
                  <p className="text-red-600 font-medium text-center">{errorMsg}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        placeholder="Your first name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        placeholder="Your last name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+977-XXXXXXXXX"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interested In</Label>
                    <select
                      id="service"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="">Select a service</option>
                      {initialServices.map((service) => (
                        <option key={service.id} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project requirements, budget, and timeline..."
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Google reCAPTCHA */}
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      sitekey={SITE_KEY}
                      onChange={handleCaptchaChange}
                      onExpired={handleCaptchaExpired}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn-gradient w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                    <Send className="ml-2" size={20} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {quoteOpen && selectedServiceId !== null && (
        <ServiceQuote
          preselectedService={selectedServiceId}
          onClose={() => {
            setQuoteOpen(false);
            setSelectedServiceId(null);
          }}
        />
      )}
    </div>
  );
}
