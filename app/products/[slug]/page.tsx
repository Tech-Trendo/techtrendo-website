import { API_URL } from "@/lib/api";
import {
  breadcrumbLd,
  canonicalUrl,
  productLd,
  seoMetadata,
  type SeoFields,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ProductDetail from "@/components/client/ProductSingle";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const REVALIDATE = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

type Product = SeoFields & {
  title: string;
  short_description: string;
  description: string;
  image: string | null;
  category: string;
};

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}/`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/products/`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const products = await res.json();
    if (!Array.isArray(products)) return [];
    return products
      .map((product: { slug?: unknown }) => product?.slug)
      .filter((slug): slug is string => typeof slug === "string" && !!slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await fetchProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await fetchProduct(slug);
  if (!product) notFound();
  return seoMetadata(
    product,
    `/products/${slug}`,
    product.title,
    product.short_description,
  );
}

export default async function ProductPage(props: Props) {
  const { slug } = await props.params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const canonical = canonicalUrl(product.canonical_url, `/products/${slug}`);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.title, path: `/products/${slug}` },
        ])}
      />
      <JsonLd
        data={productLd({
          name: product.title,
          description: product.description || product.short_description,
          url: canonical,
          image: product.image,
        })}
      />
      <ProductDetail />
    </>
  );
}