"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import type { AdminBlog, AdminCategory } from "@/lib/admin-types";
import { API_BASE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface BlogFormProps {
  mode: "create" | "edit";
  blog?: AdminBlog | null;
  categories: AdminCategory[];
}

interface FaqRow {
  question: string;
  answer: string;
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatForInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function inputClassName(hasError: boolean): string {
  return cn(
    "w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    hasError ? "border-destructive" : "border-input",
  );
}

export default function BlogForm({ mode, blog, categories }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(blog));
  const [categoryId, setCategoryId] = useState<string>(
    blog?.category_id != null ? String(blog.category_id) : "",
  );
  const [content, setContent] = useState(blog?.content ?? "");
  const [isFeatured, setIsFeatured] = useState(blog?.is_featured ?? false);
  const [pubDate, setPubDate] = useState(blog?.pub_date ? formatForInput(blog.pub_date) : "");
  const [faq, setFaq] = useState<FaqRow[]>(
    blog?.faq?.length ? blog.faq.map((f) => ({ question: f.question, answer: f.answer })) : [],
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState(blog?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(blog?.meta_description ?? "");
  const [ogTitle, setOgTitle] = useState(blog?.og_title ?? "");
  const [ogDescription, setOgDescription] = useState(blog?.og_description ?? "");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingImageUrl = useMemo(() => {
    if (!blog?.image) return null;
    return blog.image.startsWith("http") ? blog.image : `${API_BASE_URL}${blog.image}`;
  }, [blog]);

  const updateTitle = (value: string) => {
    setTitle(value);
    if (!slugEdited) setSlug(slugifyTitle(value));
  };

  const selectImage = (file: File | null) => {
    setNewImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const updateFaq = (index: number, field: keyof FaqRow, value: string) => {
    setFaq((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeFaq = (index: number) => setFaq((rows) => rows.filter((_, i) => i !== index));

  const clientErrors = (): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!title.trim()) out.title = "Title is required.";
    if (!content.trim()) out.content = "Content is required.";
    return out;
  };

  const handleSubmit = async () => {
    const local = clientErrors();
    setErrors(local);
    setFormError(null);
    if (Object.keys(local).length > 0) return;

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        content,
        is_featured: isFeatured,
        category_id: categoryId ? Number(categoryId) : null,
        meta_title: metaTitle.trim(),
        meta_description: metaDescription.trim(),
        og_title: ogTitle.trim(),
        og_description: ogDescription.trim(),
        faq: faq.map((row) => ({ question: row.question.trim(), answer: row.answer.trim() })),
      };
      if (slug.trim()) payload.slug = slug.trim();
      if (pubDate) payload.pub_date = pubDate;

      const url =
        mode === "edit" && blog
          ? `/api/admin/blogs/${blog.slug}/`
          : "/api/admin/blogs/";
      const method = mode === "edit" ? "PATCH" : "POST";

      let init: RequestInit;
      if (newImage) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          if (key === "faq") form.append(key, JSON.stringify(value));
          else if (typeof value === "boolean") form.append(key, value ? "true" : "false");
          else form.append(key, String(value));
        });
        form.append("image", newImage);
        init = { method, body: form };
      } else {
        init = { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
      }

      const res = await fetch(url, init);
      if (!res.ok) {
        let apiErrors: Record<string, unknown> | string | null = null;
        try {
          apiErrors = (await res.json()) as Record<string, unknown>;
        } catch {
          apiErrors = null;
        }
        if (apiErrors && typeof apiErrors === "object" && !Array.isArray(apiErrors)) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, value] of Object.entries(apiErrors)) {
            if (key === "non_field_errors" || key === "detail") continue;
            if (Array.isArray(value) && value.length > 0) {
              fieldErrors[key] = String(value[0]);
            } else if (typeof value === "string") {
              fieldErrors[key] = value;
            }
          }
          const nonField =
            Array.isArray(apiErrors.non_field_errors) && apiErrors.non_field_errors.length > 0
              ? String(apiErrors.non_field_errors[0])
              : typeof apiErrors.detail === "string"
                ? apiErrors.detail
                : null;
          setErrors(fieldErrors);
          setFormError(nonField);
          if (Object.keys(fieldErrors).length > 0 || nonField) {
            toast.error(nonField ?? "Some fields need attention.");
            return;
          }
        }
        toast.error("Something went wrong while saving.");
        return;
      }

      toast.success(mode === "edit" ? "Blog post updated." : "Blog post created.");
      router.push("/admin/blogs");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="max-w-3xl mx-auto pb-20"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="p-2 rounded-md border border-border text-foreground hover:bg-muted"
          aria-label="Back to blog list"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-semibold">{mode === "edit" ? "Edit Blog Post" : "New Blog Post"}</h1>
        {mode === "edit" && blog && (
          <span className="ml-auto text-xs text-muted-foreground">
            Read time: {blog.read_time} min (computed by server)
          </span>
        )}
      </div>

      {formError && <InlineError message={formError} />}

      <div className="space-y-5">
        <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Basics</h2>

          <div>
            <label htmlFor="blog-title" className="block text-sm font-medium mb-1">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="blog-title"
              value={title}
              onChange={(e) => updateTitle(e.target.value)}
              className={parseClassName(errors.title)}
              placeholder="e.g. Why Nepali Companies Are Going Remote-First in 2026"
            />
            {errors.title && <FieldError message={errors.title} />}
          </div>

          <div>
            <label htmlFor="blog-slug" className="block text-sm font-medium mb-1">
              Slug
            </label>
            <input
              id="blog-slug"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
              className={parseClassName(undefined)}
              placeholder="auto-generated from title"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to auto-generate. Public URL: /blog/{slug || "..."}
            </p>
            {errors.slug && <FieldError message={errors.slug} />}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="blog-category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="blog-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={parseClassName(errors.category_id)}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <FieldError message={errors.category_id} />}
            </div>
            <div>
              <label htmlFor="blog-pubdate" className="block text-sm font-medium mb-1">
                Publish date/time
              </label>
              <input
                id="blog-pubdate"
                type="datetime-local"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
                className={inputClassName(Boolean(errors.pub_date))}
              />
              <p className="text-xs text-muted-foreground mt-1">Defaults to now when empty.</p>
              {errors.pub_date && <FieldError message={errors.pub_date} />}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Featured post
          </label>
        </section>

        <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Featured / OG image
          </h2>
          <div className="flex items-start gap-4 flex-wrap">
            {imagePreview ? (
              <img src={imagePreview} alt="New upload preview" className="w-40 h-28 object-cover rounded-md border border-border" />
            ) : existingImageUrl ? (
              <img src={existingImageUrl} alt={blog?.title ?? "Current image"} className="w-40 h-28 object-cover rounded-md border border-border" />
            ) : (
              <div className="w-40 h-28 rounded-md border border-dashed border-muted-foreground/40 flex items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => selectImage(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 text-sm rounded-md border border-input hover:bg-muted"
              >
                {newImage ? "Replace chosen file" : "Upload image"}
              </button>
              {newImage && (
                <button
                  type="button"
                  onClick={() => selectImage(null)}
                  className="ml-2 px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"
                >
                  Clear
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                Sent as multipart when a file is chosen; otherwise left unchanged on edit.
              </p>
            </div>
          </div>
          {errors.image && <FieldError message={errors.image} />}
        </section>

        <section className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Content <span className="text-destructive">*</span>
            </h2>
          </div>
          <RichTextEditor initialContent={content} onChange={setContent} />
          <p className="px-4 py-2 text-xs text-muted-foreground">
            Rendered as HTML and stored as-is in the CMS (CKEditor-compatible formatting).
          </p>
          {errors.content && <div className="px-4 pb-2"><FieldError message={errors.content} /></div>}
        </section>

        <section className="border border-border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              FAQ (rendered as FAQPage schema)
            </h2>
            <button
              type="button"
              onClick={() => setFaq((rows) => [...rows, { question: "", answer: "" }])}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-input hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Add question
            </button>
          </div>
          {faq.length === 0 && (
            <p className="text-xs text-muted-foreground">No questions yet — optional.</p>
          )}
          {faq.map((row, index) => (
            <div key={index} className="border border-border rounded-md p-3 space-y-2 bg-background">
              <input
                value={row.question}
                onChange={(e) => updateFaq(index, "question", e.target.value)}
                placeholder={`Question ${index + 1}`}
                className={inputClassName(false)}
              />
              <textarea
                value={row.answer}
                onChange={(e) => updateFaq(index, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className={inputClassName(false)}
              />
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
          {errors.faq && <FieldError message={errors.faq} />}
        </section>

        <section className="border border-border rounded-lg bg-card">
          <button
            type="button"
            onClick={() => setSeoOpen((open) => !open)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            SEO Settings
            <ChevronDown className={cn("h-4 w-4 transition-transform", seoOpen && "rotate-180")} />
          </button>
          {seoOpen && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <label htmlFor="blog-seo-meta-title" className="block text-sm font-medium mb-1">
                  Meta title
                </label>
                <input
                  id="blog-seo-meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className={inputClassName(Boolean(errors.meta_title))}
                  placeholder="Overrides the <title> tag — defaults to the blog title"
                />
                {errors.meta_title && <FieldError message={errors.meta_title} />}
              </div>
              <div>
                <label htmlFor="blog-seo-meta-desc" className="block text-sm font-medium mb-1">
                  Meta description
                </label>
                <textarea
                  id="blog-seo-meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  className={inputClassName(Boolean(errors.meta_description))}
                />
                {errors.meta_description && <FieldError message={errors.meta_description} />}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="blog-seo-og-title" className="block text-sm font-medium mb-1">
                    OG title
                  </label>
                  <input
                    id="blog-seo-og-title"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className={inputClassName(Boolean(errors.og_title))}
                  />
                  {errors.og_title && <FieldError message={errors.og_title} />}
                </div>
                <div>
                  <label htmlFor="blog-seo-og-desc" className="block text-sm font-medium mb-1">
                    OG description
                  </label>
                  <input
                    id="blog-seo-og-desc"
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    className={inputClassName(Boolean(errors.og_description))}
                  />
                  {errors.og_description && <FieldError message={errors.og_description} />}
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur px-6 py-3 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="px-4 py-2 text-sm rounded-md border border-input hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-60 hover:opacity-90"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create post"}
          </button>
        </div>
      </div>
    </form>
  );
}

const parseClassName = (error?: string) => inputClassName(Boolean(error));

function FieldError({ message }: { message: string }) {
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-2 text-sm mb-4">
      {message}
    </div>
  );
}