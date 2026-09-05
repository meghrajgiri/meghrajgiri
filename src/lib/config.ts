import { unstable_cache } from "next/cache";
import fallbackConfig from "@/config/fallback.json";
import sections from "@/config/sections.json";
import { createAdminClient } from "./supabase-admin";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Fetch a single config section from Supabase.
 */
export async function getConfig<T = any>(key: string): Promise<T> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data?.value) {
    console.error(`Config "${key}" not found:`, error?.message);
    return {} as T;
  }

  return data.value as T;
}

/**
 * Fetch all config sections from Supabase (cached for 60s).
 */
/**
 * The sections the site actually renders — see `src/config/sections.json`, which is
 * shared with the `/api/config` allowlist and the snapshot script so that adding a
 * section is one edit rather than three.
 *
 * The table also holds rows from an earlier iteration of the site (`featured_work`,
 * `journey`, `expertise`, `process`) that no component reads. They were being fetched
 * and spread into the returned object, so every page serialised them into its RSC
 * payload — dead JSON on every request, including placeholder URLs like
 * `https://design-system.example.com`. Filtering here rather than deleting the rows
 * keeps the old content recoverable from the CMS while getting it out of the HTML.
 */
const RENDERED_SECTIONS = sections.rendered;

export const getAllConfig = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", RENDERED_SECTIONS)
      .returns<{ key: string; value: any }[]>();

    if (error || !data) {
      console.error(
        "Failed to fetch site config, serving committed snapshot:",
        error?.message,
      );
      return fallbackConfig as unknown as SiteConfig;
    }

    const config: Record<string, any> = {};
    for (const row of data) {
      config[row.key] = row.value;
    }

    // Spread over the snapshot rather than returning `config` directly. Callers read
    // `config.metadata.author` and `config.projects.projects` without optional
    // chaining, so a section missing from the response — a partial read, a row
    // deleted by accident — would throw and 500 the whole public site. Merging means
    // the worst case is one stale section, not an outage.
    return { ...fallbackConfig, ...config } as unknown as SiteConfig;
  },
  ["site-config"],
  { revalidate: 60, tags: ["site-config"] },
);

export interface SiteConfig {
  personal: {
    name: string;
    role: string;
    initials: string;
    email: string;
    location: string;
    tagline: string;
    /**
     * Entity facts. These previously lived as constants in `src/lib/schema.ts`, which
     * split the description of one person across two sources of truth — the reason the
     * site shipped `addressLocality: "Nepal"` for months while the CMS said something
     * else. They belong next to the person they describe.
     */
    locality?: string;
    region?: string;
    country?: string;
    /** Profile URLs that are not "social links" — e.g. the Toptal resume. */
    profiles?: string[];
    credentials?: Array<{
      name: string;
      category?: string;
      issuer?: string;
      url?: string;
    }>;
  };
  hero: {
    mainTitle: { line1: string; line2: string };
    description: string;
    highlightedTerms: { term1: string; term2: string };
    buttons: {
      primary: { text: string; href: string };
      secondary: { text: string; href: string };
    };
    stats: Array<{ value: string; number?: string; label: string; delay?: string }>;
    floatingSkills: string[];
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    description: string[];
    stats: Array<{ value: string; label: string }>;
    callToAction: { title: string; description: string; buttonText: string };
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    categories: Array<{
      title: string;
      icon: string;
      skills: Array<{ name: string; level: number; color: string }>;
    }>;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    projects: Array<{
      id: number;
      slug: string;
      title: string;
      description: string;
      longDescription: string;
      image: string;
      screenshots?: string[];
      /** Heading above the gallery. Defaults to "A look inside". */
      screenshotsHeading?: string;
      /**
       * Intrinsic dimensions per image URL, recorded at upload time.
       *
       * `getImageSizes` reads headers off the filesystem, which stopped being possible
       * when these moved to Supabase Storage — and without real width/height
       * `next/image` cannot reserve space, so the page shifts as each screenshot
       * loads. Written by `scripts/upload-project-images.mjs` and by the CMS uploader.
       */
      imageSizes?: Record<string, { width: number; height: number }>;
      technologies: string[];
      category: string;
      status: string;
      year: string;
      links: { demo?: string; github?: string; case_study?: string };
      highlights: string[];
      published?: boolean;
      /**
       * One measurable outcome, shown on the card. "Instead of 'Built a website'
       * write 'Increased conversions 40%'." Omit rather than invent — a card with no
       * result line is honest; a card with a made-up one is not.
       */
      impact?: string;
      /**
       * Long-form case study. Absent on the short project cards, which keep rendering
       * exactly as before — the deep template only engages once there is something to
       * put in it, so a project is never half-migrated.
       */
      caseStudy?: {
        /** One paragraph, outcome first. The passage AI search engines quote. */
        summary?: string;
        /** Headline numbers. Omit rather than invent — an empty row beats a fake one. */
        metrics?: Array<{ value: string; label: string }>;
        /** Ordered prose sections; `body` is Markdown. */
        sections?: Array<{ heading: string; body: string }>;
      };
    }>;
    callToAction: { title: string; description: string; buttonText: string };
  };
  contact: {
    title: string;
    subtitle: string;
    contactInfo: { email: string; phone: string; location: string };
    availability: {
      status: string;
      responseTime: string;
      workingHours: string;
    };
    socialLinks: Array<{
      name: string;
      platform: string;
      url: string;
      icon: string;
      label: string;
    }>;
    form: {
      fields: Record<
        string,
        { label: string; placeholder: string; type?: string }
      >;
      submitButton: string;
      successMessage: string;
      errorMessage: string;
    };
  };
  education: {
    title: string;
    subtitle: string;
    education: Array<{
      id: number;
      logo: string;
      degree: string;
      field: string;
      institution: string;
      period: string;
      type: string;
      description: string;
      skills: string[];
    }>;
    highlights: Array<{ value: string; label: string }>;
  };
  experience: {
    experiences: Array<{
      year: string;
      period: string;
      title: string;
      company: string;
      type: string;
      description: string;
      technologies: string[];
      status: string;
    }>;
  };
  /** Per-page title, description and lead copy. Editable at /cms/config/pages. */
  pages?: Record<
    string,
    {
      title?: string;
      description?: string;
      heading?: string;
      intro?: string;
      keywords?: string[];
      /** "What I take on"-style cards. */
      cards?: Array<{ title: string; body: string }>;
      /** Which shipped project used which part of the stack. */
      evidence?: Array<{ tech: string; where: string; slug: string }>;
      /** Self-contained answers, written to be quotable by an AI answer. */
      qa?: Array<{ q: string; a: string }>;
    }
  >;
  hire?: {
    pages: Array<{
      slug: string;
      stack: string;
      title: string;
      description: string;
      h1: string;
      intro: string;
      keywords: string[];
      evidence: Array<{ slug: string; name: string; note: string }>;
      qa: Array<{ q: string; a: string }>;
    }>;
    /** Questions on the /hire hub itself. */
    qa?: Array<{ q: string; a: string }>;
  };
  blog?: {
    posts: Array<{
      slug: string;
      title: string;
      metaTitle: string;
      description: string;
      published: string;
      updated?: string;
      keywords: string[];
      excerpt: string;
      /** Markdown, produced by the rich-text editor at /cms/config/blog. */
      body: string;
      draft?: boolean;
    }>;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    url: string;
    siteName: string;
    twitter?: string;
    locale: string;
    type: string;
  };
  testimonials?: {
    badge: string;
    title: string;
    subtitle: string;
    testimonials: Array<{
      id: number;
      quote: string;
      /** A real person's name. Entries without one are not rendered. */
      author: string;
      title?: string;
      company?: string;
      image?: string;
    }>;
  };
  navigation: {
    items: Array<{ href: string; label: string }>;
    mobileMenu: { footer: string };
  };
}

/**
 * Save a config section to Supabase (upsert).
 */
export async function saveConfig(key: string, value: unknown) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_config")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) throw error;
}

/**
 * Last-edit times for the config sections, used to give the sitemap a truthful
 * `lastmod` instead of the current timestamp on every request.
 *
 * Falls back to `null` rather than "now" so the caller can decide — an invented
 * lastmod is worse than an omitted one.
 */
export const getConfigTimestamps = unstable_cache(
  async (): Promise<{ site: Date | null; projects: Date | null }> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("key, updated_at")
      .returns<{ key: string; updated_at: string }[]>();

    if (error || !data?.length) return { site: null, projects: null };

    const times = data.map((r) => new Date(r.updated_at).getTime());
    const projectsRow = data.find((r) => r.key === "projects");

    return {
      site: new Date(Math.max(...times)),
      projects: projectsRow ? new Date(projectsRow.updated_at) : null,
    };
  },
  ["site-config-timestamps"],
  { revalidate: 60, tags: ["site-config"] },
);
