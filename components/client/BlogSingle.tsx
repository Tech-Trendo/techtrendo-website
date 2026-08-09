// Updated BlogDetail.tsx with preserved h1/h2 styles and blue links
// (Your full TSX file starts below)
"use client";
import { API_URL, API_BASE_URL } from "@/lib/api";
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
  read_time?: number | null;
  faq?: { question: string; answer: string }[] | null;
  related_posts?: RelatedPost[] | null;
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

interface RelatedPost {
  title: string;
  slug: string;
  image: string | null;
  pub_date: string;
  read_time?: number | null;
}

const absoluteImage = (image: string | null | undefined) => {
  if (!image) return undefined;
  if (/^https?:\/\//.test(image)) return image;
  return `${API_BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
};

const readTime = (blog: BlogData) =>
  blog.read_time ||
  Math.max(
    1,
    Math.ceil(blog.content.replace(/<[^>]+>/g, " ").split(/\s+/).length / 200),
  );

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
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

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
        const response = await axios.get<BlogData>(`${API_URL}/blogs/${slug}/`);
        setBlog(response.data);
        if (Array.isArray(response.data.related_posts) && response.data.related_posts.length > 0) {
          setRelatedPosts(response.data.related_posts);
        } else if (response.data.category?.slug) {
          const relatedRes = await axios.get<BlogData[]>(
            `${API_URL}/blogs/?category__slug=${response.data.category.slug}&page_size=4`,
          );
          const list = Array.isArray(relatedRes.data)
            ? relatedRes.data
            : (relatedRes.data as any)?.results ?? [];
          setRelatedPosts(
            list
              .filter((post: BlogData) => post.slug !== slug)
              .slice(0, 3),
          );
        }
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
      `src="${API_BASE_URL}${p1.startsWith("/") ? p1 : "/" + p1}"`
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
              {formattedDate} | {blog.category.name} | {readTime(blog)} min read
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

          {Array.isArray(blog.faq) && blog.faq.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              {blog.faq.map((item, index) => (
                <details
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <summary className="cursor-pointer px-6 py-4 font-semibold text-foreground hover:bg-slate-50 [&::-webkit-details-marker]:hidden flex items-center justify-between">
                    <span>{item.question}</span>
                    <span className="text-primary text-xl">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-muted-foreground">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="pt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.image && (
                      <div className="aspect-video overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={absoluteImage(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.read_time && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {post.read_time} min read
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
