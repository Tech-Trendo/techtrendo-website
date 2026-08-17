import type { Metadata } from "next";
import Script from "next/script";
import { countryAlternates } from "@/lib/seo";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { Toaster } from "react-hot-toast";

const GA_ID = "G-5Y03DLNYKZ";

export const metadata: Metadata = {
  metadataBase: new URL("https://techtrendo.com"),

  title: {
    default: "Tech Trendo | Global Software Development & IT Services",
    template: "%s | Tech Trendo",
  },

  description:
    "Global software development company delivering custom software, web apps, mobile apps, cloud solutions, and IT outsourcing for businesses worldwide.",

  keywords: [
    "Tech Trendo",
    "Global IT Company",
    "Software Development Company",
    "Custom Software Development",
    "Web Development Services",
    "Mobile App Development",
    "Digital Marketing Services",
    "IT Outsourcing",
    "Cloud Solutions",
    "Software Company Nepal",
    "Technology Partner",
  ],

  authors: [{ name: "Tech Trendo" }],
  creator: "Tech Trendo",
  publisher: "Tech Trendo",

  robots: {
    index: true,
    follow: true,
  },

  alternates: countryAlternates("https://techtrendo.com"),

  openGraph: {
    title: "Tech Trendo | Global Software Development & IT Services",
    description:
      "Global software development company delivering custom software, web apps, mobile apps, cloud solutions, and IT outsourcing services worldwide.",
    url: "https://techtrendo.com",
    siteName: "Tech Trendo",
    images: [
      {
        url: "https://techtrendo.com/preview.png",
        width: 1200,
        height: 630,
        alt: "Tech Trendo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tech Trendo | Global Software Development & IT Services",
    description:
      "Web, App & Software Development + Digital Marketing services for businesses worldwide.",
    images: ["https://techtrendo.com/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body className="antialiased min-h-screen flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}