"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ServiceQuote from "@/components/ServiceQuote";

export default function HeroCTA() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
        <Button
          size="lg"
          className="btn-gradient text-base sm:text-lg px-8 py-5 sm:py-6 text-white w-full sm:w-auto flex justify-center items-center"
          onClick={() => setQuoteOpen(true)}
        >
          Start a Project
          <ArrowRight className="ml-2" size={20} />
        </Button>
        <Link href="/services" prefetch={true} className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="btn-outline-gradient text-base sm:text-lg text-primary px-8 py-5 sm:py-6 w-full sm:w-auto flex justify-center items-center"
          >
            Our Services
          </Button>
        </Link>
      </div>
      {quoteOpen && (
        <ServiceQuote onClose={() => setQuoteOpen(false)} />
      )}
    </>
  );
}
