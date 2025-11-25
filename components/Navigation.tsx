'use client';
import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import logo from "@/assets/tech-trendo.png"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  const pathName = usePathname();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Courses", href: "/courses" },
    { name: "Our Services", href: "/services" },
    { name: "Our Products", href: "/products" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Verify", href: "/verify" },
  ];

  const isActive = (path: string) => pathName === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
         <Link href={'/'} className="flex items-center space-x-3">
  <img
    src='/tech-trendo.png'
    alt="Tech Trendo Logo"
    className="w-14 h-14 object-contain"
  />
  <span className="text-2xl font-bold text-foreground">Tech Trendo</span>
</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href={'contact'}>
              <Button  className="btn-gradient">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-white">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  // to={item.href}
                  href={item.href}
                  className={`text-sm font-medium py-2 px-4 rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Link href={'/contact'} onClick={() => setIsOpen(false)}>
                  <Button className="btn-gradient w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
