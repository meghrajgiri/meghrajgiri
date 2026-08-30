"use client";

import { Icon } from "@iconify/react";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

const skillSections = [
  {
    title: "Frontend",
    icon: "mdi:palette",
    description: "Modern UI/UX development",
    skills: [
      { name: "HTML5", icon: "logos:html-5" },
      { name: "React", icon: "logos:react" },
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
      { name: "JavaScript", icon: "logos:javascript" },
      { name: "Vue.js", icon: "logos:vue" },
    ],
  },
  {
    title: "Backend",
    icon: "mdi:cog",
    description: "Scalable server solutions",
    skills: [
      { name: "Python", icon: "logos:python" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Express.js", icon: "simple-icons:express" },
      { name: "FastAPI", icon: "logos:fastapi-icon" },
      { name: "Redis", icon: "logos:redis" },
      { name: "GraphQL", icon: "logos:graphql" },
    ],
  },
  {
    title: "Tools & Cloud",
    icon: "mdi:cloud",
    description: "Development & deployment tools",
    skills: [
      { name: "Kubernetes", icon: "logos:kubernetes" },
      { name: "AWS", icon: "logos:aws" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Git", icon: "logos:git-icon" },
      { name: "Figma", icon: "logos:figma" },
      { name: "Vercel", icon: "logos:vercel-icon" },
      { name: "VS Code", icon: "logos:visual-studio-code" },
    ],
  },
];

/**
 * Skills as a reference table, not a wall of pills.
 *
 * The previous centred badge-and-card treatment gave every technology equal visual
 * weight and read as decoration. Grouping them under mono category labels on a tinted
 * band makes the section scannable and stops it competing with the work above it.
 */
/**
 * Stack, as a footnote rather than a feature grid.
 *
 * The previous treatment was a four-column card grid with 28 logos — the anatomy of a
 * SaaS "features" section, and on a portfolio it competes with the work for attention
 * while saying less than a single project page does. Each project already lists the
 * stack it actually used; this is just the summary.
 */
export function SkillsSection() {
  const { skills } = useSiteConfig();

  return (
    <section id="skills" className="px-6 py-10 md:py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="nb bg-card p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-16">
          <p className="inline-block border-2 border-border bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink)]">
            {skills?.badge ?? "Stack"}
          </p>
          <div className="flex flex-col gap-6">
            {skillSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <h3 className="w-[130px] shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {section.skills.map((skill) => (
                    <li key={skill.name} className="flex items-center gap-2 text-[15px] text-muted-foreground">
                      <Icon icon={skill.icon} className="h-4 w-4 shrink-0" aria-hidden />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
