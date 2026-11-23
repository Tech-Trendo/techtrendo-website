"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { dynamicServiceQuote as ServiceQuote } from "@/components/dynamicServiceQuote";

export default function ServicesHeroCTA() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
          onClick={() => setQuoteOpen(true)}
        >
          Start a Project <ArrowRight className="ml-2" size={20} />
        </Button>
        <Link href="/portfolio" className="flex-1 sm:flex-none">
          <Button
            size="lg"
            className="btn-gradient w-full sm:w-auto"
          >
            See Related Work
          </Button>
        </Link>
      </div>
      {quoteOpen && (
        <ServiceQuote onClose={() => setQuoteOpen(false)} />
      )}
    </>
  );
}
