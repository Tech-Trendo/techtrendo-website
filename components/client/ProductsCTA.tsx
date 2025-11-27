"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import ServiceQuote from "../ServiceQuote";

export default function ProductsCTA() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-linear-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Let’s discuss how our products can help you streamline operations
            and accelerate growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-linear-to-r from-primary to-secondary text-white"
              >
                Contact Sales Team
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setQuoteOpen(true)}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </section>
      {quoteOpen && (
        <ServiceQuote
          preselectedService={undefined}
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </>
  );
}
