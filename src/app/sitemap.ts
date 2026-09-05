import { getAllConfig, getConfigTimestamps } from "@/lib/config";
import type { MetadataRoute } from "next";

/**
 * The one host this sitemap is allowed to emit.
 *
 * `metadata.url` is editable from /cms, and the site previously shipped for months
 * with it pointing at a domain that had no DNS at all — which meant every canonical,
 * every OG url and every sitemap entry named an address that did not resolve. A bad
 * value here is uniquely damaging because it is the one signal Google trusts to decide
 * which URL is authoritative, so the value is pinned rather than trusted.
 */
const CANONICAL_ORIGIN = "https://www.meghrajgiri.com";

function resolveBaseUrl(configured: string | undefined): string {
  if (!configured) return CANONICAL_ORIGIN;

  try {
    const origin = new URL(configured).origin;
    if (origin !== CANONICAL_ORIGIN) {
      console.error(
        `sitemap: ignoring configured url "${configured}" — expected ${CANONICAL_ORIGIN}`,
      );
      return CANONICAL_ORIGIN;
    }
    return origin;
  } catch {
    console.error(`sitemap: configured url "${configured}" is not a valid URL`);
    return CANONICAL_ORIGIN;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [config, timestamps] = await Promise.all([
    getAllConfig(),
    getConfigTimestamps(),
  ]);

  const baseUrl = resolveBaseUrl(config.metadata?.url);

  // Real edit times, not `new Date()`. Stamping every URL with "changed just now" on
  // every crawl is noise, and crawlers learn to discount a lastmod that always says
  // the same thing.
  const siteModified = timestamps.site ?? new Date();
  const projectsModified = timestamps.projects ?? siteModified;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: projectsModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // `/about` sits above the rest of these deliberately: it is the page that answers
    // "which Meghraj?", and every other entity signal on the site points back at it.
    {
      url: `${baseUrl}/about`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hire`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: siteModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Derived from the same CMS rows the pages render from, so publishing an article or
  // adding a hire page cannot leave it out of the sitemap. Drafts are excluded for the
  // same reason they are excluded from the index: an unfinished post that a crawler
  // finds is worse than one it never sees.
  const hirePages: MetadataRoute.Sitemap = (config.hire?.pages ?? []).map(
    (page) => ({
      url: `${baseUrl}/hire/${page.slug}`,
      lastModified: siteModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  const posts: MetadataRoute.Sitemap = (config.blog?.posts ?? [])
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.published),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const projects =
    config.projects?.projects
      ?.filter((p) => p.published !== false)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: projectsModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })) || [];

  return [...staticPages, ...hirePages, ...posts, ...projects];
}
