"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import {
  ProjectCard,
  type ProjectCardData,
} from "@/components/projects/ProjectCard";

/**
 * Featured work — six projects at equal weight, and the centre of gravity of the page.
 *
 * Three was showing roughly a fifth of the case studies that exist. Since the sections
 * that used to pad the page out (a logo grid, an empty testimonial rail, a duplicate
 * About spread) are gone, the work now occupies the space they were taking, which is
 * the arrangement a portfolio wanted in the first place.
 */
export function ProjectsSection() {
  const config = useSiteConfig();
  const projects = config.projects;
  if (!projects) return null;

  const published = (projects.projects ?? []).filter(
    (p) => p.published !== false,
  );
  const featured = published.slice(0, 6);
  if (!featured.length) return null;

  return (
    <section id="featured-work" className="px-6 pb-16 pt-6 md:pb-24 md:pt-10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="label">{projects.badge}</p>
            <h2 className="mt-3 text-[2rem] md:text-5xl">{projects.title}</h2>
          </div>
          <Link
            href="/projects"
            className="cta-ghost focus-ring inline-flex min-h-[44px] items-center px-5 text-[15px]"
          >
            {/* Not "All N projects". These are the selected ones; the index has the rest. */}
            {published.length} case studies &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project as ProjectCardData}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
