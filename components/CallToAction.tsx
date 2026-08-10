"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ServiceQuote from "@/components/ServiceQuote";

const CallToAction: React.FC = () => {
  // Modal state
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section className="section-padding bg-muted section-3d">
      <div className="container-custom text-center">
        <Card className="card-3d border-0 max-w-4xl mx-auto bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
          <CardContent className="p-12 space-y-6">
            {/* Heading */}
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Ready to Transform Your Business?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Join hundreds of satisfied clients who have elevated their digital
              presence with Tech Trendo&apos;s innovative solutions.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              {/* Open Service Quote Modal */}
              <Button
                // size="lg"
                className="bg-white text-blue-600 shadow-lg hover:bg-blue-600 hover:text-white hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                onClick={() => setQuoteOpen(true)}
              >
                Start Your Project
                <ArrowRight className="ml-2 transition-colors duration-300" size={20} />
              </Button>

              {/* Navigate to Services */}
              <Link href="/services">
                <Button
                  // size="lg"
                  // variant="outline"
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Service Quote Modal */}
      {quoteOpen && (
        <ServiceQuote
          preselectedService={undefined} // Optional: you can pass default service if needed
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </section>
  );
};

export default CallToAction;
