import { API_URL } from "@/lib/api";
import Blog, { type BlogPost } from "@/components/client/BlogPage";
import JsonLd from "@/components/JsonLd";
import { itemListLd, seoMetadata, SITE_URL } from "@/lib/seo";
import { seoData } from "@/types";
import { Metadata } from "next";

const REVALIDATE = 3600;

// Route-level ISR fallback for the blog index.
export const revalidate = 3600;

type BlogListResponse = { results: BlogPost[]; count?: number } | BlogPost[];

function listOf(data: BlogListResponse): BlogPost[] {
  return Array.isArray(data) ? data : data?.results ?? [];
}

async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/?page_size=100`, {
      next: { revalidate: REVALIDATE, tags: ["blog"] },
    });
    if (!res.ok) return [];
    return listOf(await res.json());
  } catch {
    return [];
  }
}

async function fetchFirstPage(): Promise<{ posts: BlogPost[]; total: number }> {
  try {
    const res = await fetch(`${API_URL}/blogs/?page=1`, {
      next: { revalidate: REVALIDATE, tags: ["blog"] },
    });
    if (!res.ok) return { posts: [], total: 0 };
    const data = await res.json();
    const posts = listOf(data);
    const total =
      typeof data?.count === "number" ? data.count : posts.length;
    return { posts, total };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(`${API_URL}/pages/blog`, {
      next: { revalidate: REVALIDATE, tags: ["page"] },
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return seoMetadata(
    data,
    "/blog",
    "Tech Blog | Insights on Web, Apps & Software",
    "Read the latest insights from Tech Trendo on web development, mobile apps, custom software, digital marketing, and outsourcing across global markets.",
  );
}

export default async function page() {
  // Server-render the index content so crawlers see real post links instead
  // of a "Loading blogs..." placeholder.
  const [allPosts, firstPage] = await Promise.all([
    fetchAllPosts(),
    fetchFirstPage(),
  ]);
  const initialPosts = firstPage.posts.length
    ? firstPage.posts
    : allPosts.slice(0, 20);

  const listItems = (allPosts.length ? allPosts : initialPosts).map((post) => ({
    name: post.title,
    path: `/blog/${post.slug}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${SITE_URL}/blog#blog`,
          name: "Tech Trendo Blog",
          url: `${SITE_URL}/blog`,
          publisher: { "@id": `${SITE_URL}/#organization` },
          blogPost: listItems.map((item) => ({
            "@type": "BlogPosting",
            headline: item.name,
            url: `${SITE_URL}${item.path}`,
          })),
        }}
      />
      <JsonLd
        data={itemListLd(listItems.slice(0, 20), `${SITE_URL}/blog`)}
      />
      <Blog
        initialPosts={initialPosts}
        initialTotal={firstPage.total || allPosts.length}
        allPosts={allPosts}
      />
    </>
  );
}
