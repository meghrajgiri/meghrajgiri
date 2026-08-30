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
  ];

  const projects =
    config.projects?.projects
      ?.filter((p) => p.published !== false)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: projectsModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })) || [];

  return [...staticPages, ...projects];
}
