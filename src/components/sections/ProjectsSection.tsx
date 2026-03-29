"use client";

import { SITE_DATA } from "@/config";
import Link from "next/link";

export function ProjectsSection() {
  const projects = SITE_DATA.projects.projects.slice(0, 3);

  return (
    <section id="projects" className="bg-slate-50/50 px-6 py-24 dark:bg-slate-100/5">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-sm dark:border-primary/10 dark:bg-primary/5">
              <span className="text-sm font-medium text-primary">
                {SITE_DATA.projects.badge}
              </span>
            </div>
            <h2 className="text-gradient text-4xl font-bold md:text-5xl">
              {SITE_DATA.projects.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {SITE_DATA.projects.subtitle}
            </p>
          </div>

          {/* Projects Grid - Top 3 */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="hover-lift group overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {project.status === "In Progress" && (
                    <div className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      In Progress
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold transition-colors duration-200 group-hover:text-primary">
                      {project.title}
                    </h3>
                    <span className="bg-gradient shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-primary-foreground">
                      {project.category}
                    </span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All */}
          <div className="text-center">
            <Link
              href="/projects"
              className="bg-gradient focus-ring hover-lift inline-flex items-center gap-2 rounded-lg px-8 py-4 font-semibold text-primary-foreground"
            >
              View All Projects
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
