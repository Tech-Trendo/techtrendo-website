"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ServiceQuote from "@/components/ServiceQuote";

interface ServiceCardActionsProps {
  serviceId: number;
  serviceSlug: string;
}

export default function ServiceCardActions({ serviceId, serviceSlug }: ServiceCardActionsProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          className="btn-gradient w-full"
          onClick={() => setQuoteOpen(true)}
        >
          Start a Project <ArrowRight className="ml-2" size={16} />
        </Button>
        <Link href={`/services/${serviceSlug}`} className="flex-1 w-full">
          <Button
            className="btn-gradient w-full"
          >
            See Related Work
          </Button>
        </Link>
      </div>
      {quoteOpen && (
        <ServiceQuote
          preselectedService={serviceId}
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </>
  );
}
