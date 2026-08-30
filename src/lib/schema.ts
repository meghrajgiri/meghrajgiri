import type { SiteConfig } from "./config";

/**
 * Structured data shared across the site.
 *
 * Everything hangs off a single `Person` node with a stable `@id`. Other nodes
 * reference it by that id rather than redeclaring the person, which is what lets
 * Google treat the pages as one entity instead of several similar-looking ones —
 * the specific problem this site has, with three unrelated people named Meghraj
 * competing in its own brand SERP.
 */
export function personId(url: string) {
  return `${url}/#person`;
}

export function websiteId(url: string) {
  return `${url}/#website`;
}

export function buildPerson(config: SiteConfig) {
  const url = config.metadata.url;

  return {
    "@type": "Person",
    "@id": personId(url),
    name: config.personal.name,
    url,
    jobTitle: config.personal.role,
    email: config.personal.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: config.personal.location,
    },
    // Only profile URLs belong here. A `mailto:` is not a profile, and a link that
    // 404s is worse than an absent one — both weaken entity resolution rather than
    // helping it.
    sameAs:
      config.contact?.socialLinks
        ?.filter((link) => link.url?.startsWith("http"))
        .map((link) => link.url) ?? [],
    knowsAbout: config.skills?.categories?.flatMap((c) =>
      c.skills.map((s) => s.name),
    ),
  };
}

export function buildWebSite(config: SiteConfig) {
  const url = config.metadata.url;

  return {
    "@type": "WebSite",
    "@id": websiteId(url),
    url,
    name: config.metadata.siteName,
    description: config.metadata.description,
    inLanguage: config.metadata.locale?.replace("_", "-") ?? "en-US",
    publisher: { "@id": personId(url) },
  };
}

export function buildBreadcrumbs(
  baseUrl: string,
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.path}`,
    })),
  };
}

/** Wraps nodes in a single `@graph` so one script tag carries the whole page. */
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
