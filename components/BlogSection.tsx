"use client";
import { API_URL } from "@/lib/api";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  slug: string;
  meta_title: string | null;
  meta_description: string;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string;
  twitter_image: string | null;
  canonical_url: string | null;
}

interface BlogPost {
  id: number;
  title: string;
  is_featured: boolean;
  content: string;
  pub_date: string;
  image: string;
  slug: string;
  category: Category;
  meta_title: string | null;
  meta_description: string;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
}

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/?page_size=100`);
        if (!res.ok) {
          setBlogs([]);
          return;
        }
        const data = await res.json();
        const postsArray = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.results) ? data.results : []);
        // Filter only featured posts
        const featured = postsArray.filter(
          (post: BlogPost) => post.is_featured
        );
        setBlogs(featured);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="section-padding bg-background section-3d">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            Latest <span className="gradient-text">Blog Posts</span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Stay updated with the latest trends, insights, and expert opinions
            from our team.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-muted-foreground text-lg">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg">
            No featured blog posts found.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {blogs.map((post) => {
              const fallbackImage = "https://via.placeholder.com/600x400?text=Tech+Blog";
              return (
                <Card
                  key={post.id}
                  className="card-3d border-0 bg-linear-to-br from-background to-muted/50 overflow-hidden"
                >
                  <div className="w-full h-48 bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={post.image || fallbackImage}
                      alt={post.title}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                      onError={(e) => (e.currentTarget.src = fallbackImage)}
                    />
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Calendar size={16} />
                      <span>
                        {new Date(post.pub_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                  <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {post.meta_description ||
                      post.og_description ||
                      post.content.slice(0, 150) + "..."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      By Tech Trendo
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-all duration-300 hover:translate-x-1"
                    >
                      Read More
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button
              // size="lg"
              // variant="outline"
              className="btn-outline-gradient shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Posts
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
