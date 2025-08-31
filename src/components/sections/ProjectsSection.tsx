"use client";

import { useState } from "react";

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Apps" },
    { id: "mobile", name: "Mobile" },
    { id: "design", name: "Design" },
  ];

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and Stripe integration.",
      image: "/api/placeholder/600/400",
      category: "web",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#",
      github: "#",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Modern task management application with real-time collaboration features.",
      image: "/api/placeholder/600/400",
      category: "web",
      tech: ["Next.js", "TypeScript", "Prisma", "Socket.io"],
      link: "#",
      github: "#",
      featured: true
    },
    {
      id: 3,
      title: "Mobile Fitness Tracker",
      description: "React Native app for tracking workouts and nutrition with offline support.",
      image: "/api/placeholder/600/400",
      category: "mobile",
      tech: ["React Native", "SQLite", "Redux"],
      link: "#",
      github: "#",
      featured: false
    },
    {
      id: 4,
      title: "Brand Identity Design",
      description: "Complete brand identity and web design for a tech startup.",
      image: "/api/placeholder/600/400",
      category: "design",
      tech: ["Figma", "Adobe Creative Suite"],
      link: "#",
      github: "#",
      featured: false
    },
    {
      id: 5,
      title: "Analytics Dashboard",
      description: "Real-time analytics dashboard with interactive charts and data visualization.",
      image: "/api/placeholder/600/400",
      category: "web",
      tech: ["React", "D3.js", "Python", "PostgreSQL"],
      link: "#",
      github: "#",
      featured: true
    },
    {
      id: 6,
      title: "Portfolio Website",
      description: "Minimalist portfolio website with dark mode and smooth animations.",
      image: "/api/placeholder/600/400",
      category: "web",
      tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
      link: "#",
      github: "#",
      featured: false
    }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">Featured Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of projects that showcase my skills and passion for development
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
                className={`group space-y-4 ${project.featured ? 'lg:col-span-2' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-xl bg-muted aspect-video hover-lift">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 bg-gradient-subtle flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-gradient rounded-lg mx-auto flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Project Preview</div>
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      View Project
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      GitHub
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-gradient text-primary-foreground text-xs font-semibold rounded-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
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
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Interested in seeing more of my work or discussing a project?
            </p>
            <button 
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-gradient text-primary-foreground rounded-lg font-semibold hover-lift focus-ring"
            >
              Let&apos;s Work Together
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}