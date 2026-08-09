import VerifyPage from "@/components/client/VerifyPage";
import { Metadata } from "next";
import { countryAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Verify Certificate | Tech Trendo",
  description:
    "Verify a Tech Trendo certificate instantly. Check the authenticity of course, internship, and employment certificates issued by Tech Trendo, Nepal.",
  alternates: countryAlternates("https://techtrendo.com/verify"),
  openGraph: {
    title: "Verify Certificate | Tech Trendo",
    description:
      "Verify the authenticity of Tech Trendo course, internship, and employment certificates.",
    url: "https://techtrendo.com/verify",
    siteName: "Tech Trendo",
    images: [
      {
        url: "https://techtrendo.com/preview.png",
        width: 1200,
        height: 630,
        alt: "Tech Trendo Certificate Verification",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify Certificate | Tech Trendo",
    description:
      "Verify the authenticity of Tech Trendo certificates online.",
    images: ["https://techtrendo.com/preview.png"],
  },
};

export default function page() {
  return <VerifyPage />;
}