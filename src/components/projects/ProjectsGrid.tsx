"use client";

import { useState } from "react";
import {
  ProjectCard,
  type ProjectCardData,
} from "@/components/projects/ProjectCard";

interface Project extends ProjectCardData {
  id: number;
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All projects" },
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
    <div className="flex flex-col gap-8">
      {/* Filter.
          
          The selected state used to be the brand fill and nothing else, which under a
          monochrome palette would leave selection carried by luminance alone. It is now
          an inverted block *and* `aria-pressed`, so the state is announced rather than
          only shown — colour was never an acceptable sole indicator, and here there is
          no colour left to lean on anyway. */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter projects by category"
      >
        {categories.map((category) => {
          const active = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              aria-pressed={active}
              className={`focus-ring min-h-[44px] rounded-[6px] px-5 py-2.5 text-[15px] font-medium transition-colors duration-200 ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
