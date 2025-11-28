// Updated BlogDetail.tsx with preserved h1/h2 styles and blue links
// (Your full TSX file starts below)
"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
// import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// CKEditor default styles
// import "ckeditor5/ckeditor5.css";

interface BlogCategory {
  id: number;
  slug: string;
  name: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
}

interface BlogData {
  id: number;
  title: string;
  content: string;
  pub_date: string;
  image: string | null;
  slug: string;
  category: BlogCategory;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
}

const API_BASE_URL = "https://app.techtrendo.com/api/app/blogs";

const BlogDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const navigate = (path: string) => {
    router.push(path);
  };

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No blog identifier provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchBlogDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<BlogData>(`${API_BASE_URL}/${slug}/`);
        setBlog(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("The requested blog was not found (404).");
        } else {
          console.error("Error fetching blog detail:", err);
          setError("An unknown error occurred while loading the blog.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8 max-w-lg bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-600">
            {error?.includes("not found") ? "Blog Not Found" : "Loading Error"}
          </h1>
          <p className="text-muted-foreground">
            {error || "The blog data could not be loaded."}
          </p>
          <Button onClick={() => navigate("/blog")} className="btn-gradient">
            <ArrowLeft className="mr-2" size={16} />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(blog.pub_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //   const seoTitle = blog.meta_title || blog.title;
  //   const seoDescription =
  //     blog.meta_description || blog.content.replace(/<[^>]+>/g, "").slice(0, 150);
  //   const seoKeywords = blog.meta_keywords || "";
  //   const seoCanonical = blog.canonical_url || window.location.href;

  //   const ogTitle = blog.og_title || seoTitle;
  //   const ogDescription = blog.og_description || seoDescription;
  //   const ogImage = blog.og_image || undefined;

  //   const twitterTitle = blog.twitter_title || seoTitle;
  //   const twitterDescription = blog.twitter_description || seoDescription;
  //   const twitterImage = blog.twitter_image || undefined;

  // ✅ FIX: Add absolute URL for CKEditor images
  const fixedContent = blog.content.replace(
    /src="(?!http)([^"]+)"/g,
    (match, p1) =>
      `src="https://app.techtrendo.com${p1.startsWith("/") ? p1 : "/" + p1}"`
  );

  return (
    // <HelmetProvider>
    <div className="flex flex-col min-h-screen bg-background">
      {/* SEO */}
      {/* <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          {seoKeywords && <meta name="keywords" content={seoKeywords} />}
          <link rel="canonical" href={seoCanonical} />

          <meta property="og:title" content={ogTitle} />
          <meta property="og:description" content={ogDescription} />
          {ogImage && <meta property="og:image" content={ogImage} />}
          <meta property="og:type" content="article" />

          <meta name="twitter:title" content={twitterTitle} />
          <meta name="twitter:description" content={twitterDescription} />
          {twitterImage && <meta name="twitter:image" content={twitterImage} />}
        </Helmet> */}

      {/* Hero */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-accent text-white py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 mb-8"
            >
              <ArrowLeft className="mr-2" size={16} /> Back to Blogs
            </Button>
          </Link>

          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">{blog.title}</h1>
            <p className="text-lg md:text-xl text-white/90">
              {formattedDate} | {blog.category.name}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {blog.image && (
            <motion.img
              src={blog.image}
              alt={blog.title}
              className="w-full rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Preserved CKEditor formatting + blue links */}
          <div
            className="ck-content w-full prose max-w-none font-['Inter, sans-serif'] [&_a]:text-blue-600 [&_a:hover]:underline [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul_ul]:list-disc [&_ol]:list-decimal [&_ol_ol]:list-decimal [&_li]:my-1 [&_ul]:ml-6 [&_ol]:ml-6"
            dangerouslySetInnerHTML={{ __html: fixedContent }}
          />

          <div className="text-center pt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => navigate("/blog")}
            >
              Back to Blogs
            </Button>
          </div>
        </div>
      </section>
    </div>
    // </HelmetProvider>
  );
};

export default BlogDetail;
