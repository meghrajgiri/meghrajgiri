"use client";

import { useState } from "react";
import { SITE_DATA } from "@/config";

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "Fin-Tech", name: "Fin-Tech" },
    { id: "Ed-Tech", name: "Ed-Tech" },
    { id: "E-Commerce", name: "E-Commerce" },
    { id: "Web3", name: "Web3" },
  ];

  const projects = SITE_DATA.projects.projects;

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="projects" className="py-24 px-6 bg-slate-50/50 dark:bg-slate-100/5">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/5 border border-primary/20 dark:border-primary/10 backdrop-blur-sm">
              <span className="text-sm font-medium text-primary">{SITE_DATA.projects.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">{SITE_DATA.projects.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {SITE_DATA.projects.subtitle}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus-ring ${
                  selectedCategory === category.id
                    ? "bg-gradient text-primary-foreground"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="group space-y-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-xl bg-muted aspect-video hover-lift">
                  {/* Project image */}
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <span className="px-2 py-1 bg-gradient text-primary-foreground text-xs font-semibold rounded-md">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">
              {SITE_DATA.projects.callToAction.title}
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              {SITE_DATA.projects.callToAction.description}
            </p>
            <button
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-gradient text-primary-foreground rounded-lg font-semibold hover-lift focus-ring"
            >
              {SITE_DATA.projects.callToAction.buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}