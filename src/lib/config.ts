import { unstable_cache } from "next/cache";
import sections from "@/config/sections.json";
import { createAdminClient } from "./supabase-admin";
import { projectsForSite, projectsLastModified } from "./projects";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Fetch a single config section from Supabase.
 *
 * Throws rather than returning an empty object. This feeds the CMS editor, and an editor
 * that loads blank on a failed read is an editor whose next Save writes that blank over
 * good content. A 500 is recoverable; a successful save of nothing is not.
 */
export async function getConfig<T = any>(key: string): Promise<T> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data?.value) {
    throw new Error(`Config "${key}" could not be read: ${error?.message ?? "no value"}`);
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

    // Supabase is the only source of content. There is no committed snapshot to fall
    // back to any more, which makes this the one place that decides what a failed read
    // means — and the answer is that it is not renderable.
    //
    // Throwing fails the build, and on Vercel a failed build leaves the previous
    // deployment serving. At runtime the pages are already prerendered, so a failed
    // revalidation keeps serving the last good copy. Both are better than rendering a
    // portfolio with no work in it, which is what returning a partial object would do —
    // and would do silently, looking entirely deliberate.
    if (error || !data) {
      throw new Error(`Failed to fetch site config: ${error?.message ?? "no rows"}`);
    }

    const config: Record<string, any> = {};
    for (const row of data) {
      config[row.key] = row.value;
    }

    // Callers read `config.metadata.author` and `config.projects.projects` without
    // optional chaining. A section missing from the response used to be papered over by
    // the snapshot; now it has to be caught here, by name, rather than surfacing later as
    // a TypeError inside a component.
    const missing = RENDERED_SECTIONS.filter((key) => !(key in config));
    if (missing.length > 0) {
      throw new Error(`Config sections missing from Supabase: ${missing.join(", ")}`);
    }

    // Projects live in their own table, one row each. The section row in `site_config`
    // keeps the badge, title, subtitle and call to action; the array is composed here so
    // every consumer still reads `config.projects.projects` and none of them had to
    // learn where it came from.
    config.projects = { ...config.projects, projects: await projectsForSite() };

    return config as unknown as SiteConfig;
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
       * Named groups within the gallery.
       *
       * A project carries anywhere from four to seventeen screenshots, and shown as one
       * undifferentiated run they ask the reader to work out what each is. Grouping them
       * — "Seller app", "Checkout", "Admin" — turns the gallery into something readable.
       *
       * Optional: with no groups the flat `screenshots` list renders exactly as before,
       * so a project is never obliged to organise its images before it can show them.
       */
      screenshotGroups?: Array<{
        heading: string;
        caption?: string;
        images: string[];
      }>;
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
      links: {
        demo?: string;
        github?: string;
        case_study?: string;
        /** Registry listing — third-party proof a package is actually published. */
        npm?: string;
        /** Store listings — third-party proof a mobile app actually shipped. */
        appStore?: string;
        playStore?: string;
      };
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
        /**
         * Role, timeline, team and status.
         *
         * Answers "what did you actually do here" in three seconds, which the research
         * behind docs/case-studies/STRUCTURE.md identifies as the thing readers need
         * first on any project involving other people. Every field is optional; blanks
         * are dropped rather than rendered as empty labels.
         */
        facts?: {
          role?: string;
          timeline?: string;
          team?: string;
          status?: string;
        };
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

    // The project pages' lastmod comes from the projects table, not from the
    // `site_config` row that used to hold them — that row now changes only when the
    // section heading does, which would report every project as untouched since.
    const projects = await projectsLastModified();

    // Null rather than a throw: an absent lastmod is a smaller problem than a sitemap
    // that fails to render, and `getAllConfig` has already established the site is
    // readable by the time anything asks for this.
    if (error || !data?.length) return { site: null, projects };

    const times = data.map((r) => new Date(r.updated_at).getTime());
    if (projects) times.push(projects.getTime());

    return { site: new Date(Math.max(...times)), projects };
  },
  ["site-config-timestamps"],
  { revalidate: 60, tags: ["site-config"] },
);
