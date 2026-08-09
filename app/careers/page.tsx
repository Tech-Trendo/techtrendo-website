import { API_URL } from "@/lib/api";
import Careers from "@/components/client/CareerPage";
import { seoData } from "@/types";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, jobPostingLd, seoMetadata } from "@/lib/seo";

const REVALIDATE = 3600;

type Job = {
  id: number;
  title: string;
  location: string;
  type: string;
  description: string;
  deadline: string | null;
  date_posted: string;
  status: string;
};

function toEmploymentType(
  type: string | null | undefined,
  title: string | null | undefined,
): string {
  const haystack = `${type ?? ""} ${title ?? ""}`.toLowerCase();
  if (haystack.includes("intern")) return "INTERNSHIP";
  if (haystack.includes("part")) return "PART_TIME";
  if (haystack.includes("contract")) return "CONTRACTOR";
  return "FULL_TIME";
}

export async function generateMetadata(): Promise<Metadata> {
  let data: seoData | null = null;
  try {
    const res = await fetch(
      `${API_URL}/pages/careers`,
      {
        next: { revalidate: REVALIDATE, tags: ["page"] },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {}
  return seoMetadata(
    data,
    "/careers",
    "Careers at Tech Trendo | Jobs & Internships in Nepal",
    "Join Tech Trendo – explore internships and employment opportunities in web development, mobile apps, software, and digital marketing careers in Nepal.",
  );
}

async function fetchJobs(): Promise<Job[]> {
  try {
    const [jobsRes, internsRes] = await Promise.all([
      fetch(`${API_URL}/jobs/`, { next: { revalidate: REVALIDATE, tags: ["job"] } }),
      fetch(`${API_URL}/interns/`, { next: { revalidate: REVALIDATE, tags: ["job"] } }),
    ]);
    const [jobs, interns] = await Promise.all([
      jobsRes.ok ? jobsRes.json() : [],
      internsRes.ok ? internsRes.json() : [],
    ]);
    return [...(interns || []), ...(jobs || [])];
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await fetchJobs();
  const openJobs = Array.isArray(jobs)
    ? jobs.filter((job: Job) => job && job.title)
    : [];

  return (
    <>
      {openJobs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: openJobs.map((job, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: jobPostingLd({
                title: job.title,
                description: job.description,
                location: job.location || "Sundarharaincha, Nepal",
                employmentType: toEmploymentType(job.type, job.title),
                datePosted: job.date_posted,
                validThrough: job.deadline,
                url: `${SITE_URL}/careers`,
              }),
            })),
          }}
        />
      )}
      <Careers />
    </>
  );
}