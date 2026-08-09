import { API_URL } from "@/lib/api";
import {
  blogPostingLd,
  breadcrumbLd,
  canonicalUrl,
  faqLd,
  seoMetadata,
  type FaqItem,
  type SeoFields,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import BlogDetail from "@/components/client/BlogSingle";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const REVALIDATE = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

type Blog = SeoFields & {
  title: string;
  content: string;
  pub_date: string;
  image: string | null;
  category: { slug: string; name: string } | null;
  faq?: FaqItem[] | null;
};

async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}/`, {
      next: { revalidate: REVALIDATE, tags: ["blog"] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/?page_size=100`, {
      next: { revalidate: REVALIDATE, tags: ["blog"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = Array.isArray(data) ? data : data?.results;
    if (!Array.isArray(posts)) return [];
    return posts
      .map((post: { slug?: unknown }) => post?.slug)
      .filter((slug): slug is string => typeof slug === "string" && !!slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await fetchBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = await fetchBlog(slug);
  if (!blog) notFound();
  return seoMetadata(
    blog,
    `/blog/${slug}`,
    blog.title,
    blog.meta_description || "Read the latest blog post from Tech Trendo.",
  );
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params;
  const blog = await fetchBlog(slug);
  if (!blog) notFound();

  const canonical = canonicalUrl(blog.canonical_url, `/blog/${slug}`);
  const faqs = Array.isArray(blog.faq) ? blog.faq : [];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: blog.title, path: `/blog/${slug}` },
        ])}
      />
      <JsonLd
        data={blogPostingLd({
          headline: blog.title,
          description: blog.meta_description || blog.title,
          image: blog.image,
          datePublished: blog.pub_date,
          dateModified: blog.pub_date,
          canonical,
          categoryName: blog.category?.name,
        })}
      />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      <BlogDetail />
    </>
  );
}