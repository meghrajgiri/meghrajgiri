"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * One project card, used by both grids.
 *
 * The home page and `/projects` previously drew their own cards in two different
 * visual languages: the home grid was neubrutalist (hard offset, 2px border, window
 * chrome) and `/projects` was left over from a glassmorphism pass (`rounded-xl`,
 * `bg-card/50`, `backdrop-blur-sm`, a soft 20px lift). Clicking a card therefore
 * changed the design of the site mid-journey. One component means that cannot drift
 * apart again.
 *
 * The macOS title bar that used to sit on top is gone. It was borrowed chrome: three
 * traffic lights and a fake file path implying a window that is not a window, on a
 * card that is not an application. It also spent the card's first 40px on decoration
 * before the work itself appeared. The thumbnail now starts at the top edge, which is
 * both the honest frame and the one that shows more of the screenshot.
 */

export type ProjectCardData = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  year: string;
  status?: string;
  impact?: string;
  links?: Record<string, string | undefined>;
};

/**
 * What a visitor can actually open, per project.
 *
 * These links already existed on every case-study page and nowhere else, so neither
 * grid gave any signal about which of these are running software and which are
 * write-ups. For a developer portfolio that is the difference between a claim and a
 * thing you can go and use.
 */
const LINK_LABELS: Record<string, string> = {
  demo: "Live",
  github: "Code",
  npm: "npm",
  appStore: "iOS",
  playStore: "Android",
};
const LINK_ORDER = ["demo", "github", "npm", "appStore", "playStore"] as const;

export function ProjectCard({
  project,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 372px",
  priority = false,
}: {
  project: ProjectCardData;
  sizes?: string;
  priority?: boolean;
}) {
  const links = project.links ?? {};
  const available = LINK_ORDER.filter((k) => links[k]);

  return (
    /* An <article> rather than a wrapping <a>: the external links below have to be
       real anchors, and an anchor inside an anchor is invalid markup that browsers
       recover from unpredictably. The title link carries an ::after overlay so the
       whole card is still one click, and the external links sit above that overlay
       on their own stacking context. */
    <article className="panel panel-i group relative flex flex-col overflow-hidden bg-card">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[5px] border-b border-border bg-muted">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {/* Status was an amber pill — the one saturated colour left in the grid, and
            on a monochrome page it read as an error state rather than as progress.
            An outlined chip on the elevated surface says the same thing quietly. */}
        {project.status === "In Progress" && (
          <span className="panel absolute right-3 top-3 bg-elevated px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            In progress
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="label">{project.category}</span>
          <span aria-hidden className="text-faint">
            &middot;
          </span>
          <span className="label">{project.year}</span>
        </div>

        <h3 className="mt-2.5 text-[17px] leading-[1.3]">
          <Link
            href={`/projects/${project.slug}`}
            className="focus-ring after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-muted-foreground">
          {project.description}
        </p>

        {project.impact && (
          <p className="mt-2.5 inline-flex items-center gap-2 text-[13px] font-semibold text-foreground">
            <span className="h-px w-4 bg-border-strong" aria-hidden />
            {project.impact}
          </p>
        )}

        {/* One bottom-anchored footer, not two independently floated rows. */}
        <div className="mt-auto pt-4">
          <p className="font-mono text-[11px] leading-relaxed text-faint">
            {project.technologies.slice(0, 4).join(" · ")}
            {project.technologies.length > 4 &&
              ` +${project.technologies.length - 4}`}
          </p>

          {available.length > 0 && (
            <div className="relative z-10 mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-3">
              {available.map((key) => (
                <a
                  key={key}
                  href={links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground"
                >
                  {LINK_LABELS[key]}
                  <span className="sr-only">
                    {" "}
                    — {project.title} (opens in a new tab)
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
