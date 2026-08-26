"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  ExternalLink,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Image,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Package,
  PenSquare,
  Receipt,
  ScrollText,
  Settings,
  Star,
  Tags,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ href: "/dash", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/dash/blogs", label: "Posts", icon: FileText },
      { href: "/dash/blog-categories", label: "Blog Categories", icon: Tags },
      { href: "/dash/services", label: "Services", icon: PenSquare },
      { href: "/dash/products", label: "Products", icon: Package },
      { href: "/dash/portfolio", label: "Portfolio", icon: FolderOpen },
      { href: "/dash/pages", label: "Pages", icon: FileText },
    ],
  },
  {
    label: "Testimonials",
    items: [
      { href: "/dash/testimonials", label: "Testimonials", icon: Star },
      { href: "/dash/reviews", label: "Reviews", icon: MessageSquareQuote },
    ],
  },
  {
    label: "Media",
    items: [
      { href: "/dash/events", label: "Events", icon: CalendarDays },
      { href: "/dash/gallery-items", label: "Gallery", icon: Image },
      { href: "/dash/company-logos", label: "Company Logos", icon: Landmark },
    ],
  },
  {
    label: "Markets",
    items: [{ href: "/dash/markets", label: "Market Pages", icon: Globe }],
  },
  {
    label: "Careers",
    items: [
      { href: "/dash/jobs", label: "Jobs", icon: Briefcase },
      { href: "/dash/interns", label: "Internships", icon: GraduationCap },
      { href: "/dash/job-applications", label: "Job Applications", icon: ClipboardList },
      { href: "/dash/intern-applications", label: "Intern Applications", icon: ClipboardList },
      { href: "/dash/resumes", label: "Resumes", icon: ScrollText },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/dash/contact-messages", label: "Contacts", icon: Mail },
      { href: "/dash/quote-requests", label: "Quote Requests", icon: Receipt },
      { href: "/dash/suggested-topics", label: "Suggested Topics", icon: Lightbulb },
      { href: "/dash/mail-subscribers", label: "Subscribers", icon: Users },
    ],
  },
  {
    label: "Settings",
    items: [{ href: "/dash/site-settings", label: "Site Settings", icon: Settings }],
  },
];

function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST", cache: "no-store" });
    toast.success("Logged out.");
    router.replace("/dash/login");
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <img
          src="/tech-trendo.png"
          alt="Tech Trendo Logo"
          className="h-9 w-9 object-contain"
        />
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">TechTrendo</p>
          <p className="text-xs font-medium text-primary">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-4 px-3 py-4">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label ?? `group-${groupIndex}`} className="space-y-1">
            {group.label && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <AdminSidebar />
      </div>

      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img src="/tech-trendo.png" alt="Tech Trendo Logo" className="h-7 w-7 object-contain" />
        <span className="font-bold tracking-tight">
          TechTrendo <span className="text-primary">Admin</span>
        </span>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex shadow-xl">
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-2 mt-4 h-fit rounded-md p-1.5 text-white hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="px-4 py-8">{children}</div>
      </main>
    </div>
  );
}