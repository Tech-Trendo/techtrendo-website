"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, User } from "lucide-react";
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
}
const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get<BlogPost[]>(
          "https://app.techtrendo.com/api/app/blogs/"
        );
        setBlogPosts(res.data);
      } catch (err) {
        setError("Failed to fetch blog posts");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories =
    blogPosts.length > 0
      ? [
          "All",
          ...Array.from(
            new Set(
              blogPosts.map((post) => post.category?.name || "Uncategorized")
            )
          ),
        ]
      : ["All"];

  const featuredPosts = blogPosts.filter((post) => post.is_featured);
  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category?.name === selectedCategory);

  const handleSubscribe = async () => {
    if (!email) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }
    try {
      const res = await axios.post(
        "https://app.techtrendo.com/api/app/mail-subscribers/",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="card-hover border-0 shadow-large"
                >
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
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "btn-gradient" : ""}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              All <span className="gradient-text">Articles</span>
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No posts available in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {post.category?.name || "Uncategorized"}
                        </Badge>
                      </div>
                      <div className="w-full h-48 overflow-hidden rounded-lg">
                        <img
                          src={post.image || fallbackImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
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
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.pub_date)}</span>
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
