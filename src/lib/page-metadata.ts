import type { SiteConfig } from "./config";
import type { Metadata } from "next";

/**
 * Metadata for a standalone page.
 *
 * The site's sections used to exist only as `#anchors` on the home page, which meant
 * About and Contact had no URL of their own — nothing to rank, nothing to link to,
 * nothing a search result or an AI answer could point at. Splitting them into real
 * routes only helps if each one carries its own title, description and canonical, so
 * this exists to make getting that wrong harder than getting it right.
 */
/**
 * Per-page copy from the CMS, with a code fallback.
 *
 * The fallback is not decoration: `pages` is a single CMS row, and if it is missing a
 * key — a typo in the editor, a section deleted by accident — the alternative to a
 * fallback is a page that renders with an empty `<title>`. Losing an optimised title
 * is survivable; shipping a blank one is not.
 */
export function pageCopy(
  config: SiteConfig,
  key: string,
  fallback: { title: string; description: string; heading?: string; intro?: string },
) {
  const stored = config.pages?.[key];
  return {
    title: stored?.title?.trim() || fallback.title,
    description: stored?.description?.trim() || fallback.description,
    heading: stored?.heading?.trim() || fallback.heading,
    intro: stored?.intro?.trim() || fallback.intro,
    keywords: stored?.keywords?.length ? stored.keywords : undefined,
  };
}

export function pageMetadata(
  config: SiteConfig,
  {
    path,
    title,
    description,
    keywords,
    type = "website",
  }: {
    path: `/${string}`;
    title: string;
    description: string;
    keywords?: string[];
    /** `profile` only for the pages that are about the person themselves. */
    type?: "profile" | "website";
  },
): Metadata {
  const url = `${config.metadata.url}${path}`;

  // Declaring an `openGraph` object here replaces the one the layout generated, and a
  // replacement that omits `images` takes the site-wide card down with it — these
  // pages shipped with `twitter:card: summary_large_image` and nothing to show in it.
  // The root `opengraph-image` route is named explicitly so that cannot happen again.
  const image = `${config.metadata.url}/opengraph-image`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: config.metadata.locale,
      url,
      title,
      description,
      siteName: config.metadata.siteName,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: config.metadata.twitter,
      images: [image],
    },
  };
}
