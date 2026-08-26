import ServiceQuote from "@/components/ServiceQuote";
import { Suspense } from "react";
import { Metadata } from "next";
import { countryAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Get a Free Quote | Tech Trendo" },
  description:
    "Request a free, no-obligation quote for web development, mobile apps, software solutions, and digital marketing from Tech Trendo, a global software development company.",
  alternates: countryAlternates("https://techtrendo.com/quote"),
  openGraph: {
    title: "Get a Free Quote | Tech Trendo",
    description:
      "Request a free quote for web, app, and software development plus digital marketing services from Tech Trendo.",
    url: "https://techtrendo.com/quote",
    siteName: "Tech Trendo",
    images: [
      {
        url: "https://techtrendo.com/preview.png",
        width: 1200,
        height: 630,
        alt: "Get a Free Quote | Tech Trendo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get a Free Quote | Tech Trendo",
    description:
      "Request a free quote for IT services from Tech Trendo.",
    images: ["https://techtrendo.com/preview.png"],
  },
};

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceQuote />
    </Suspense>
  );
}