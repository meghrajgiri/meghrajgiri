"use client";

import Link from "next/link";
import { useState } from "react";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  status: string;
  year: string;
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Projects" },
    ...Array.from(new Set(projects.map((p) => p.category))).map((cat) => ({
      id: cat,
      name: cat,
    })),
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`focus-ring rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-gradient text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
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
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.year}</span>
                <span className="font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
                  View Details &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
