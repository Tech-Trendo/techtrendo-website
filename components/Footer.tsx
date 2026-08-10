'use client';
import { API_URL } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import TikTokIcon from "./ui/tiktokicon";
import axios from "axios";
import Image from "next/image";


const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Courses", href: "/courses" },
    { name: "Our Services", href: "/services" },
  ];

  const supportLinks = [
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },

  ];

  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/techtrendo.np", label: "Facebook" },
    { Icon: Twitter, href: "https://x.com/tech_trendo", label: "Twitter" },
    { Icon: Linkedin, href: "https://www.linkedin.com/company/tech-trendo/", label: "LinkedIn" },
    { Icon: Instagram, href: "https://www.instagram.com/tech.trendo.np/", label: "Instagram" },
    { Icon: TikTokIcon, href: "https://www.tiktok.com/@tech.trendo/", label: "TikTok" },
  ];

  const handleSubscribe = async () => {
    if (!email) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/mail-subscribers/`, { email });
      if (res.status === 201) {
        setSubscriptionStatus("success");
        setSubscriptionMessage("Thank you! You have successfully subscribed to our newsletter.");
        setEmail("");
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.email &&
        err.response.data.email.length > 0
      ) {
        setSubscriptionMessage(err.response.data.email[0]);
      } else {
        setSubscriptionMessage("Subscription failed. Please try again later.");
      }
      setSubscriptionStatus("error");
    }
  };

  return (
    <footer className="bg-foreground text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
             <div className="w-16 h-16 flex items-center justify-center">
  <Image
    src='/tech-trendo.png'
    width={100}
    height={100}
    alt="Tech Trendo Logo"
    className="w-full h-full object-contain p-1"
  />
</div>
              <span className="text-xl font-bold">Tech Trendo</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Best IT Company In Eastern Nepal providing real-time and effective IT solutions to enhance digital presence and operational efficiency.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-primary" />
                <span>info@techtrendo.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-primary" />
                <span>+977-9815602535</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin size={16} className="text-primary" />
                <span> Sundarharaincha, Morang (Near Itahari)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-md text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {subscriptionStatus !== "idle" && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    subscriptionStatus === "success" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {subscriptionMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Tech Trendo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
