import type { SiteConfig } from "./config";

/**
 * What of the site config is allowed to reach the browser.
 *
 * Deliberately not inside `SiteConfigProvider`, even though that is where it is consumed.
 * A `"use client"` module's runtime exports become client references when a server
 * component imports them — so `PROJECT_CARD_FIELDS` arrived in the layout as a proxy and
 * `.filter` was not a function, which fails at prerender rather than at compile. Types
 * survive that boundary because they are erased; values do not. This module has no
 * directive, so both sides get the real thing.
 */

/**
 * The fields a project card renders — and therefore the only ones that travel.
 *
 * An allowlist rather than a list of things to strip, because this is a payload and a
 * privacy boundary. A denylist leaks by default: a field added to a project later would
 * silently start shipping on every page until someone noticed. Adding one here is a
 * deliberate act.
 */
export const PROJECT_CARD_FIELDS = [
  "id",
  "slug",
  "title",
  "description",
  "image",
  "technologies",
  "category",
  "status",
  "year",
  "links",
  "highlights",
  "published",
  "impact",
] as const;

/** A project as the client actually receives it: enough to render a card, no more. */
export type ProjectCard = Pick<
  SiteConfig["projects"]["projects"][number],
  (typeof PROJECT_CARD_FIELDS)[number]
>;

/**
 * The config as the browser receives it.
 *
 * Deliberately not `SiteConfig`. The layout removes `pages`, `hire` and `blog` outright
 * and reduces each project to its card fields, so typing this as the full config would be
 * a lie the compiler tells on your behalf: a client component could read
 * `project.caseStudy`, typecheck cleanly, and find `undefined` at runtime.
 */
export type ClientSiteConfig = Omit<
  SiteConfig,
  "pages" | "hire" | "blog" | "projects"
> & {
  projects: Omit<SiteConfig["projects"], "projects"> & {
    projects: ProjectCard[];
  };
};

/** Reduce a full project to the card the client is allowed to see. */
export function toProjectCard(
  project: SiteConfig["projects"]["projects"][number],
): ProjectCard {
  return Object.fromEntries(
    PROJECT_CARD_FIELDS.filter((key) => key in project).map((key) => [
      key,
      project[key],
    ]),
  ) as ProjectCard;
}
