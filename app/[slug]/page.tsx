import { API_URL } from "@/lib/api";
import {
  breadcrumbLd,
  seoMetadata,
  type SeoFields,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import TeamProfile from "@/components/client/TeamProfile";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const REVALIDATE = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

type Member = SeoFields & {
  name: string;
  role: string;
};

async function fetchMember(slug: string): Promise<Member | null> {
  try {
    const res = await fetch(`${API_URL}/members/${slug}/`, {
      next: { revalidate: REVALIDATE, tags: ["member"] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const member = await fetchMember(slug);
  if (!member) notFound();
  return seoMetadata(
    member,
    `/${slug}`,
    `${member.name} | ${member.role} - Tech Trendo`,
    `${member.name} is a ${member.role.toLowerCase()} at Tech Trendo, a leading IT company in Eastern Nepal specializing in web development, mobile apps, software solutions, and digital marketing.`,
  );
}

export default async function TeamPage(props: Props) {
  const { slug } = await props.params;
  const member = await fetchMember(slug);
  if (!member) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: member.name, path: `/${slug}` },
        ])}
      />
      <TeamProfile />
    </>
  );
}