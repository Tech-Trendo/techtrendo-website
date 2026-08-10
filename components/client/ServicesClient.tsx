"use client";
import { API_URL } from "@/lib/api";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import ServiceQuote from "../ServiceQuote";
export default function ServicesClient() {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(0);

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/mail-subscribers/`,
        { email }
      );
      if (res.status === 201) {
        setSubscriptionStatus("success");
        setSubscriptionMessage(
          "Thank you! You have successfully subscribed to our newsletter."
        );
        setEmail("");
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.email &&
        err.response.data.email.length > 0
      ) {
        setSubscriptionMessage(err.response.data.email[0]);
      } else {
        setSubscriptionMessage("Subscription failed. Please try again later.");
      }
      setSubscriptionStatus("error");
    }
  };
  return (
    <>
      {/* Service Quote Modal */}
      {quoteOpen && selectedService !== null && (
        <ServiceQuote
          preselectedService={selectedService}
          onClose={() => setQuoteOpen(false)}
        />
      )}
      {/* Newsletter Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <Card className="card-hover bg-linear-to-r from-primary to-secondary text-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest insights, tips, and
                updates from the world of technology.
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </div>
              {subscriptionStatus !== "idle" && (
                <p
                  className={`mt-4 font-medium ${
                    subscriptionStatus === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {subscriptionMessage}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let&apos;s discuss your project and see how we can help bring your vision
            to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-gradient"
              onClick={() => setQuoteOpen(true)}
            >
              Start Your Project <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
