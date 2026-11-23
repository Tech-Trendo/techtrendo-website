"use client";
import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  pub_date: string;
  is_featured: boolean;
  meta_description: string | null;
  og_description: string | null;
  excerpt: string;
}

interface Category {
  id: number;
  name: string;
}

const BlogSection: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  return (
    <section className="section-padding bg-background section-3d">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Latest <span className="gradient-text">Blog Posts</span>
            </h2>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends, insights, and expert opinions
              from our team.
            </p>
          </Reveal>
        </div>

        {/* Loading State */}
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg">
            No featured blog posts found.
          </div>
        ) : (
          <Reveal
            delay={0.3}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <Card
                key={post.id}
                className="card-3d border-0 bg-linear-to-br from-background to-muted/50 overflow-hidden"
              >
                <div className="relative w-full h-48 bg-slate-50 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                      Image unavailable
                    </div>
                  )}
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
                    {post.excerpt}
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
            ))}
          </Reveal>
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
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
