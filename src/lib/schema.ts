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

function websiteId(url: string) {
  return `${url}/#website`;
}

/**
 * Where the person actually is.
 *
 * `personal.location` is a display string ("Butwal, Nepal") and `addressLocality`
 * means a city specifically, so the parts are stored separately in the CMS and read
 * here. They used to be constants in this file, which split the description of one
 * person across two sources of truth — the reason the site shipped
 * `addressLocality: "Nepal"` for months. The fallback exists only so a config edit
 * cannot leave the node addressless.
 */
function home(config: SiteConfig) {
  const { locality, region, country } = config.personal;
  return {
    locality: locality?.trim() || config.personal.location,
    region: region?.trim(),
    country: country?.trim() || "NP",
  };
}

/**
 * Credentials a third party actually issued.
 *
 * The only claims on the site someone else had to agree to, which makes them worth
 * more per byte than any amount of self-description. A credential with no name is
 * dropped rather than emitted empty.
 */
function credentials(config: SiteConfig) {
  return (config.personal.credentials ?? [])
    .filter((c) => c.name?.trim())
    .map((c) => ({
      "@type": "EducationalOccupationalCredential" as const,
      name: c.name,
      ...(c.category && { credentialCategory: c.category }),
      ...(c.issuer && {
        recognizedBy: { "@type": "Organization" as const, name: c.issuer },
      }),
      ...(c.url?.startsWith("http") && { url: c.url }),
    }));
}

/** Roles the config marks as current — the basis for `worksFor`. */
function currentEmployers(config: SiteConfig) {
  return (config.experience?.experiences ?? [])
    .filter((role) => role.status === "current" && role.company?.trim())
    .map((role) => ({ "@type": "Organization" as const, name: role.company }));
}

/**
 * Schools, most recent first.
 *
 * A named institution is the strongest disambiguating fact a person node can carry,
 * and it is only credible because `EducationSection` now renders the same entries as
 * visible copy — structured data that claims more than the page shows is a guideline
 * violation, not an optimisation.
 */
function schools(config: SiteConfig) {
  return (config.education?.education ?? [])
    .filter((entry) => entry.institution?.trim())
    .map((entry) => ({
      "@type": "EducationalOrganization" as const,
      name: entry.institution,
    }));
}

export function buildPerson(config: SiteConfig) {
  const url = config.metadata.url;
  const employers = currentEmployers(config);
  const alumniOf = schools(config);
  const place = home(config);
  const creds = credentials(config);
  const profiles = (config.personal.profiles ?? []).filter((p) =>
    p?.startsWith("http"),
  );

  /**
   * `sameAs` is for URLs that *identify the same person* — the profiles a search
   * engine reconciles an entity against. A booking or scheduling page is a service
   * this person offers, not another profile of them, so those platforms are excluded
   * even though they belong in the footer's Connect column beside the rest.
   */
  const NOT_IDENTITY = new Set(["calendly", "cal", "calcom", "savvycal"]);
  const socials =
    config.contact?.socialLinks
      ?.filter(
        (link) =>
          link.url?.startsWith("http") &&
          !NOT_IDENTITY.has((link.platform ?? "").toLowerCase()),
      )
      .map((link) => link.url) ?? [];

  return {
    "@type": "Person",
    "@id": personId(url),
    name: config.personal.name,
    url,
    image: `${url}/Meghraj.jpg`,
    description: config.metadata.description,
    jobTitle: config.personal.role,
    email: config.personal.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.locality,
      ...(place.region && { addressRegion: place.region }),
      addressCountry: place.country,
    },
    homeLocation: {
      "@type": "Place",
      name: config.personal.location,
    },
    nationality: { "@type": "Country", name: "Nepal" },
    knowsLanguage: ["en", "ne"],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: { "@type": "Country", name: "Nepal" },
    },
    ...(employers.length > 0 && {
      worksFor: employers.length === 1 ? employers[0] : employers,
    }),
    ...(alumniOf.length > 0 && {
      alumniOf: alumniOf.length === 1 ? alumniOf[0] : alumniOf,
    }),
    ...(creds.length > 0 && { hasCredential: creds }),
    // Only profile URLs belong here. A `mailto:` is not a profile, and a link that
    // 404s is worse than an absent one — both weaken entity resolution rather than
    // helping it.
    // Deduplicated: the Toptal resume is listed in `PROFILES` and is now also a real
    // link in `contact.socialLinks`, and a `sameAs` array that names the same URL
    // twice is a malformed signal rather than a stronger one.
    sameAs: [...new Set([...socials, ...profiles])],
    knowsAbout: config.skills?.categories?.flatMap((c) =>
      c.skills.map((s) => s.name),
    ),
  };
}

/**
 * The home page as the person's profile page.
 *
 * `ProfilePage` tells a consumer that this URL is *about* the person rather than
 * merely mentioning them — the distinction an AI answer needs before it will attribute
 * a claim to someone.
 */
export function buildProfilePage(config: SiteConfig, path = "", name?: string) {
  const url = config.metadata.url;

  return {
    "@type": "ProfilePage",
    "@id": `${url}${path}/#profilepage`,
    url: `${url}${path}`,
    name: name ?? config.metadata.title,
    isPartOf: { "@id": websiteId(url) },
    about: { "@id": personId(url) },
    mainEntity: { "@id": personId(url) },
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

/**
 * Unfilled editorial placeholders — `[N weeks]`, `[specific constraint]`, and the
 * instruction-to-self prose that ships with a case-study template.
 *
 * Matches a bracketed run containing a space, which is what separates a placeholder
 * from legitimate bracketed prose like "[sic]".
 */
const PLACEHOLDER = /\[[^\]]*\s[^\]]*\]/;

/**
 * Drops any string property still carrying template text.
 *
 * `/projects/cannabiz-elite` shipped `"...shipped in [N weeks]. The hardest part was
 * ... [specific constraint]"` into production `CreativeWork.abstract`, where it was
 * served to every structured-data consumer and AI crawler. Fixing that one string is
 * not enough: the same class of bug recurs every time a new case study is drafted in
 * the CMS and published before its numbers land. Omitting the property is strictly
 * better than describing the work with a blank to be filled in later.
 */
function withoutPlaceholders<T>(node: T): T {
  if (typeof node === "string") {
    return (PLACEHOLDER.test(node) ? undefined : node) as T;
  }
  if (Array.isArray(node)) {
    return node.map(withoutPlaceholders).filter((v) => v !== undefined) as T;
  }
  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node)
        .map(([key, value]) => [key, withoutPlaceholders(value)])
        .filter(([, value]) => value !== undefined),
    ) as T;
  }
  return node;
}

/** Wraps nodes in a single `@graph` so one script tag carries the whole page. */
export function graph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": withoutPlaceholders(nodes),
  };
}
