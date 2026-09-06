/**
 * Derive a URL slug from a project name.
 *
 * Accents are decomposed before the strip so "Café" becomes "cafe" rather than "caf" —
 * the naive version silently eats the letter.
 *
 * Shared between the CMS form, which mirrors the title into the slug while a project is
 * still untitled, and the API route, which has to name a project before there is a title
 * to name it after.
 */
export function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * The slug a project carries before it has a name.
 *
 * A row needs a unique key the moment it exists, but the name arrives later — on the
 * project's own page, which is where naming a thing belongs. So it is created under a
 * placeholder, and the form mirrors the title into the slug until someone edits the slug
 * themselves.
 */
export const PLACEHOLDER_SLUG = "untitled";

/** True while a project has never been named, so the slug is still free to follow. */
export function isPlaceholderSlug(slug: string) {
  return new RegExp(`^${PLACEHOLDER_SLUG}(-\\d+)?$`).test(slug);
}

/**
 * `base`, or `base-2`, `base-3` … — whichever is free.
 *
 * A name can repeat where a URL cannot, so a second "Portfolio" becomes portfolio-2
 * rather than an error somebody has to resolve by inventing a slug.
 */
export function uniqueSlug(base: string, taken: Iterable<string>) {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}
