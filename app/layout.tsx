import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Trendo | Best IT Company in Eastern Nepal",
  description:
    "Tech Trendo – Eastern Nepal’s Best & Leading IT company for Web, App, Software Development & Digital Marketing that drives real business growth.",
  keywords: [
    "Tech Trendo,Best IT Company Nepal, IT Company Nepal,IT Company Eastern Nepal, Web Development, Mobile App Development, Software Development, Digital Marketing, SEO Services, Tech Company Itahari, tech trend, tech in trend, web, app, software, App Development in Itahari, Software Company in Itahari,Software Company in Dharan,Software Company in Biratnagar,Software Company in Jhapa,Software Company in Morang,Software Company in Sunsari",
  ],
  twitter: {
    title: "Tech Trendo | Best IT Company in Eastern Nepal",
    description:
      "Tech Trendo is Eastern Nepal’s leading IT company providing software, app, web development and digital marketing solutions that drive real business growth.",
    images: ["https://techtrendo.com/preview.png"],
  },
  openGraph: {
    title: "Tech Trendo | Best IT Company in Eastern Nepal",
    description:
      "Tech Trendo is Eastern Nepal’s leading IT company providing software, app, web development and digital marketing solutions that drive real business growth.",
    url: "https://techtrendo.com",
    siteName: "Tech Trendo",
    images: ["https://techtrendo.com/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
