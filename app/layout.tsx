import type { Metadata } from "next";
import Script from "next/script";
import { countryAlternates } from "@/lib/seo";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const GA_ID = "G-5Y03DLNYKZ";

export const metadata: Metadata = {
  metadataBase: new URL("https://techtrendo.com"),

  title: {
    default: "Tech Trendo | Best IT Company in Eastern Nepal",
    template: "%s | Tech Trendo",
  },

  description:
    "Tech Trendo – Eastern Nepal’s leading IT company providing web development, mobile apps, software solutions, and digital marketing services that drive real business growth.",

  keywords: [
    "Tech Trendo",
    "IT Company Nepal",
    "Best IT Company Eastern Nepal",
    "Web Development Nepal",
    "Mobile App Development Nepal",
    "Software Development Nepal",
    "Digital Marketing Nepal",
    "SEO Services Nepal",
    "IT Company Itahari",
    "Software Company Biratnagar",
    "Software Company Dharan",
    "Software Company Jhapa",
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
    title: "Tech Trendo | Best IT Company in Eastern Nepal",
    description:
      "Leading IT company in Eastern Nepal for web, app, and software development with powerful digital marketing solutions.",
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
    title: "Tech Trendo | Best IT Company in Eastern Nepal",
    description:
      "Web, App & Software Development + Digital Marketing services in Nepal.",
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
        <Navigation />
        <Toaster />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}