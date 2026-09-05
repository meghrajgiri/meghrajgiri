"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { WindowBar } from "@/components/projects/WindowFrame";

/**
 * Featured work — three projects at equal weight.
 *
 * A previous pass ran the lead project at hero scale with two beneath it. That gave a
 * clear reading order but made the first project dominate the whole section, and the
 * two below it read as afterthoughts. Equal cards let someone scan all three in one
 * pass and pick, which is what a visitor is actually doing here.
 *
 * Source thumbnails run 1.73:1 to 2.15:1, so every frame is a fixed ratio with
 * `object-cover` — a deliberate crop instead of three mismatched heights.
 */
export function ProjectsSection() {
  const config = useSiteConfig();
  const projects = config.projects;
  if (!projects) return null;

  const published = (projects.projects ?? []).filter((p) => p.published !== false);
  const featured = published.slice(0, 3);
  if (!featured.length) return null;

  return (
    <section id="featured-work" className="px-6 pb-14 pt-4 md:pb-20 md:pt-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-block border-2 border-border bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink)]">
              {projects.badge}
            </p>
            <h2 className="mt-3 text-[2rem] md:text-5xl">{projects.title}</h2>
          </div>
          <Link
            href="/projects"
            className="nb nb-sm nb-press focus-ring inline-flex min-h-[44px] items-center bg-brand px-4 text-[15px] font-bold text-[var(--brand-ink)]"
          >
            {/* Not "All N projects". The site states 20+ products shipped, and seven
                case studies are published — so claiming these are *all* of them
                contradicted the headline stat and made both numbers look invented.
                They are the selected ones. */}
            {published.length} case studies &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-14 md:gap-8 lg:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="nb nb-press group flex flex-col overflow-hidden bg-card"
            >
              <WindowBar path={`~/work/${project.slug}`} />
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-border bg-muted">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 372px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="border-2 border-border bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--brand-ink)]">
                    {project.category}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {project.year}
                  </span>
                </div>

                <h3 className="mt-3 text-xl leading-snug">
                  {project.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {project.impact && (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-text)]">
                    <span className="h-[3px] w-4 bg-brand" aria-hidden />
                    {project.impact}
                  </p>
                )}

                {/* Pushed to the bottom so the stack lines up across cards of
                    different description lengths. */}
                <p className="mt-auto pt-5 font-mono text-[12px] leading-relaxed text-muted-foreground">
                  {project.technologies.slice(0, 4).join(" · ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
