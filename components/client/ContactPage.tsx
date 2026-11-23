"use client";
import { API_URL, RECAPTCHA_SITE_KEY as SITE_KEY } from "@/lib/api";

import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dynamicServiceQuote as ServiceQuote } from "@/components/dynamicServiceQuote";

const Contact = () => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  // Scroll to top on page load
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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@techtrendo.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+977-9815602535",
      description: "Sunday-Fri from 9am to 8pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Sundarharaincha, Morang (Near Itahari)",
      description: "Our office location",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "9:00 AM - 6:00 PM",
      description: "Sunday to Friday",
    },
  ];

  const services = [
    "Web Development",
    "Mobile App Development",
    "Digital Marketing",
    "Graphic Design",
    "Software Development",
    "ICT Services",
    "Other",
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Ready to start your project? Let&apos;s discuss how we can help you
            achieve your goals.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We&apos;re here to help and answer any questions you might have
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                    <info.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {info.title}
                  </h3>
                  <p className="text-lg font-medium text-primary">
                    {info.details}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="card-hover bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    Send Us a Message
                  </h3>
                  <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as soon as
                    possible.
                  </p>
                </div>

                {successMsg && (
                  <p className="text-green-600 font-medium">{successMsg}</p>
                )}
                {errorMsg && (
                  <p className="text-red-600 font-medium">{errorMsg}</p>
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
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project or ask any questions..."
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

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <Card className="card-hover">
                <CardContent className="p-0">
                  <iframe
                    title="Tech Trendo Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d673.028359307861!2d87.2863306!3d26.6599577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6bdfdec9696b%3A0x7a6e08093fd08d89!2sTech%20Trendo%20%3A%20Best%20IT%20Company%20in%20East%20Nepal!5e0!3m2!1sen!2snp!4v1696154438023!5m2!1sen!2snp"
                    className="w-full h-64 rounded-lg border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">
                    Office Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Address
                      </h4>
                      <p className="text-muted-foreground">
                        Tech Trendo Multipurpose Company Pvt. Ltd.
                        <br />
                        Sundarharaincha, Morang
                        <br />
                        (Near Itahari)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Business Hours
                      </h4>
                      <p className="text-muted-foreground">
                        Sunday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: Closed
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Emergency Contact
                      </h4>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-primary">
                          +977-9815602535
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does a typical project take?",
                answer:
                  "Project timelines vary depending on scope and complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months. We'll provide a detailed timeline during consultation.",
              },
              {
                question: "Do you provide ongoing support?",
                answer:
                  "Yes, we offer comprehensive support and maintenance packages for all our projects. This includes bug fixes, updates, and technical support.",
              },
              {
                question: "What technologies do you work with?",
                answer:
                  "We work with modern technologies including React, Node.js, Flutter, Laravel, and many others. We choose the best technology stack for each project's requirements.",
              },
              {
                question: "Can you work with our existing team?",
                answer:
                  "Absolutely! We're experienced in collaborating with in-house teams and can adapt to your existing workflows and development processes.",
              },
            ].map((faq, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
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

      {/* CTA Section */}
      <section className="section-padding bg-linear-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Let&apos;s discuss your ideas and turn them into reality. Contact us
            today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="text-black hover:bg-white hover:text-primary hover:border-white transition-colors duration-200"
              onClick={() => setShowQuoteModal(true)}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Service Quote Modal */}
      {showQuoteModal && (
        <ServiceQuote onClose={() => setShowQuoteModal(false)} />
      )}
    </div>
  );
};

export default Contact;
