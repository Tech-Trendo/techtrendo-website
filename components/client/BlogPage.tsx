"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import axios from "axios";
import SuggestTopic from "@/components/SuggestTopic"; // import the modal component

interface Category {
  id: number;
  name: string;
  slug: string;
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
  read_time?: number | null;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  // Separate loading flags so we never unmount the whole page.
  // - initialLoading: true only until the very first successful fetch (categories)
  // - postsLoading: true while (re)fetching the posts grid specifically
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([
    { name: "All", slug: "All" }
  ]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  const POSTS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Newsletter subscription
  const [email, setEmail] = useState<string>("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [subscriptionMessage, setSubscriptionMessage] = useState<string>("");

  // Suggest Topic modal
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch unique categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<any>(
          `${API_URL}/blogs/?page_size=100`
        );
        const data = res.data;
        const postsArray = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.results) ? data.results : []);

        const catMap = new Map<string, string>();
        postsArray.forEach((post: any) => {
          if (post.category?.name && post.category?.slug) {
            catMap.set(post.category.name, post.category.slug);
          }
        });

        const extractedCategories = [{ name: "All", slug: "All" }];
        catMap.forEach((slug, name) => {
          extractedCategories.push({ name, slug });
        });
        setCategories(extractedCategories);

        // Save featured posts from full list
        const featured = postsArray.filter((post: any) => post.is_featured);
        setFeaturedPosts(featured);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blog posts based on page and category
  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      setPostsLoading(true);
      try {
        let url = `${API_URL}/blogs/?page=${currentPage}`;
        if (selectedCategory !== "All") {
          const cat = categories.find((c) => c.name === selectedCategory);
          if (cat && cat.slug !== "All") {
            url += `&category=${cat.slug}`;
          }
        }

        const res = await axios.get<any>(url);
        if (cancelled) return;

        const data = res.data;
        const postsArray = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.results) ? data.results : []);

        const count = data && typeof data.count === "number" ? data.count : postsArray.length;

        setBlogPosts(postsArray);
        setTotalPosts(count);
        setError(null);
      } catch (err) {
        if (!cancelled) setError("Failed to fetch blog posts");
      } finally {
        if (!cancelled) {
          setPostsLoading(false);
          setInitialLoading(false);
        }
      }
    };
    fetchBlogs();

    return () => {
      cancelled = true;
    };
  }, [currentPage, selectedCategory, categories]);

  // Sort blog posts so featured ones appear first
  const currentPosts = [...blogPosts].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const articlesSection = document.getElementById("all-articles-section");
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = async () => {
    if (!email) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/mail-subscribers/`,
        { email }
      );
      if (res.status === 201) {
        setSubscriptionStatus("success");
        setSubscriptionMessage(
          "Thank you! You have successfully subscribed to our newsletter."
        );
        setEmail("");
      }
    } catch (err: any) {
      if (err.response?.data?.email && err.response.data.email.length > 0) {
        setSubscriptionMessage(err.response.data.email[0]);
      } else {
        setSubscriptionMessage("Subscription failed. Please try again later.");
      }
      setSubscriptionStatus("error");
    }
  };

  const renderContent = (content: string) => {
    const isHTMLContent = /<\/?[a-z][\s\S]*>/i.test(content);
    return (
      <p
        className="text-muted-foreground leading-relaxed line-clamp-3"
        dangerouslySetInnerHTML={{
          __html: isHTMLContent ? content : content.replace(/\r\n/g, "<br/>"),
        }}
      />
    );
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fallbackImage = "https://via.placeholder.com/600x400?text=Tech+Blog";

  // Only show a full-page loading state on the very first load.
  // After that, the rest of the page (hero, featured, filters, newsletter, CTA)
  // stays mounted and only the articles grid shows its own loading/empty state.
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Tech Blog</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Insights, tutorials, and trends from the world of technology
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Featured <span className="gradient-text">Articles</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="card-hover border-0 shadow-large overflow-hidden"
                >
                  <div className="w-full h-56 bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={post.image || fallbackImage}
                      alt={post.title}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                      onError={(e) => (e.currentTarget.src = fallbackImage)}
                    />
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-linear-to-r from-primary to-secondary text-white">
                          Featured
                        </Badge>
                        <Badge variant="outline">
                          {post.category?.name || "Uncategorized"}
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground leading-tight">
                        {post.title}
                      </h3>
                      {renderContent(post.content)}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User size={16} />
                          <span>Tech Trendo</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{formatDate(post.pub_date)}</span>
                        </div>
                        {post.read_time ? (
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{post.read_time} min read</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <Button className="btn-gradient w-full">
                        Read Full Article
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-muted">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={selectedCategory === category.name ? "btn-gradient" : ""}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section id="all-articles-section" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              All <span className="gradient-text">Articles</span>
            </h2>
          </div>

          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : postsLoading ? (
            // Keep the grid's footprint so the page doesn't jump, and keep
            // everything else on the page mounted while this refetches.
            <div className="flex justify-center items-center min-h-[30vh]">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : currentPosts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No posts available in this category.
            </p>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <Card key={post.id} className="card-hover">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {post.category?.name || "Uncategorized"}
                          </Badge>
                        </div>
                        <div className="w-full h-48 bg-slate-50 overflow-hidden rounded-lg flex items-center justify-center p-2">
                          <img
                            src={post.image || fallbackImage}
                            alt={post.title}
                            className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                            onError={(e) => (e.currentTarget.src = fallbackImage)}
                          />
                        </div>

                        <h3 className="text-xl font-bold text-foreground leading-tight">
                          {post.title}
                        </h3>
                        {renderContent(post.content)}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>Tech Trendo</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{formatDate(post.pub_date)}</span>
                          </div>
                          {post.read_time ? (
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{post.read_time} min read</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <Link href={`/blog/${post.slug}`} className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                          <ArrowRight className="ml-2" size={14} />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-slate-200 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      className={currentPage === pageNumber ? "btn-gradient text-white border-0" : "border-slate-200 hover:bg-slate-100"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-slate-200 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <Card className="card-hover bg-linear-to-r from-primary to-secondary text-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Subscribe to our newsletter and never miss our latest insights,
                tutorials, and industry updates.
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </div>

              {subscriptionStatus !== "idle" && (
                <p
                  className={`mt-4 font-medium ${
                    subscriptionStatus === "success"
                      ? "text-white"
                      : "text-red-300"
                  }`}
                >
                  {subscriptionMessage}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-background">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Have a Topic Suggestion?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you! Suggest topics you'd like us to cover or
            share your own expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-gradient"
              onClick={() => setIsSuggestModalOpen(true)}
            >
              Suggest a Topic
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Suggest Topic Modal */}
      {isSuggestModalOpen && (
        <SuggestTopic
          isOpen={isSuggestModalOpen}
          onClose={() => setIsSuggestModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Blog;