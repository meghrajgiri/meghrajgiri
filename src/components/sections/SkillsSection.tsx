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

export function SkillsSection() {
  const siteConfig = useSiteConfig();

  return (
    <section id="skills" className="bg-background px-6 py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-sm dark:border-primary/10 dark:bg-primary/5">
              <span className="text-sm font-medium text-primary">
                {siteConfig.skills.badge}
              </span>
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">
              {siteConfig.skills.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {siteConfig.skills.subtitle}
            </p>
          </div>

          {/* Skill Categories */}
          <div className="space-y-14">
            {skillSections.map((section) => (
              <div key={section.title} className="space-y-6">
                {/* Category Header */}
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Icon
                      icon={section.icon}
                      className="text-xl text-foreground"
                    />
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>

                {/* Skills Grid */}
                <div className="flex flex-wrap justify-center gap-4">
                  {section.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group flex h-[110px] w-[130px] flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/40 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                    >
                      <Icon
                        icon={skill.icon}
                        className="text-3xl transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
