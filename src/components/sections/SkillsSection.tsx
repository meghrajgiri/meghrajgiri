"use client";

import { Icon } from '@iconify/react';
import { SITE_DATA } from "@/config";

export function SkillsSection() {
  const skillSections = [
    {
      title: "Frontend",
      icon: "mdi:palette",
      description: "Modern UI/UX development",
      skills: [
        { name: "React", icon: "logos:react" },
        { name: "Next.js", icon: "logos:nextjs-icon" },
        { name: "TypeScript", icon: "logos:typescript-icon" },
        { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
        { name: "JavaScript", icon: "logos:javascript" },
        { name: "Vue.js", icon: "logos:vue" },
        { name: "CSS3", icon: "logos:css-3" },
        { name: "HTML5", icon: "logos:html-5" }
      ]
    },
    {
      title: "Backend",
      icon: "mdi:cog",
      description: "Scalable server solutions",
      skills: [
        { name: "Node.js", icon: "logos:nodejs-icon" },
        { name: "Python", icon: "logos:python" },
        { name: "PostgreSQL", icon: "logos:postgresql" },
        { name: "MongoDB", icon: "logos:mongodb-icon" },
        { name: "Express.js", icon: "simple-icons:express" },
        { name: "FastAPI", icon: "logos:fastapi-icon" },
        { name: "Redis", icon: "logos:redis" },
        { name: "GraphQL", icon: "logos:graphql" }
      ]
    },
    {
      title: "Tools & Cloud",
      icon: "mdi:cloud",
      description: "Development & deployment tools",
      skills: [
        { name: "AWS", icon: "logos:aws" },
        { name: "Docker", icon: "logos:docker-icon" },
        { name: "Git", icon: "logos:git-icon" },
        { name: "Figma", icon: "logos:figma" },
        { name: "Vercel", icon: "logos:vercel-icon" },
        { name: "VS Code", icon: "logos:visual-studio-code" },
        { name: "Postman", icon: "logos:postman-icon" },
        { name: "Kubernetes", icon: "logos:kubernetes" }
      ]
    },
    {
      title: "Other Skills",
      icon: "mdi:star",
      description: "APIs, testing & optimization",
      skills: [
        { name: "REST APIs", icon: "mdi:api" },
        { name: "Testing", icon: "mdi:test-tube" },
        { name: "Performance", icon: "mdi:speedometer" },
        { name: "SEO", icon: "mdi:magnify" },
        { name: "Accessibility", icon: "mdi:wheelchair-accessibility" },
        { name: "CI/CD", icon: "mdi:sync" },
        { name: "Monitoring", icon: "mdi:chart-line" },
        { name: "Security", icon: "mdi:shield-check" }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 px-6 overflow-hidden bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/5 border border-primary/20 dark:border-primary/10 backdrop-blur-sm">
              <span className="text-sm font-medium text-primary">{SITE_DATA.skills.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {SITE_DATA.skills.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {SITE_DATA.skills.subtitle}
            </p>
          </div>

          {/* Marquee Skills Sections */}
          <div className="space-y-12">
            {skillSections.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-6">
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <Icon icon={section.icon} className="text-2xl text-primary" />
                    <h3 className="text-2xl font-bold">{section.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{section.description}</p>
                </div>

                {/* Marquee Container */}
                <div className="relative overflow-hidden">
                  <div 
                    className={`flex gap-6 w-max ${sectionIndex % 2 === 1 ? 'animate-marquee-reverse' : 'animate-marquee'}`}
                  >
                    {/* First set of skills */}
                    {section.skills.map((skill) => (
                      <div 
                        key={`${skill.name}-1`}
                        className="group relative bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 
                          hover:border-primary/30 hover:bg-card/50 transition-all duration-300 hover:scale-105
                          flex flex-col items-center justify-center text-center space-y-3 h-[120px] w-[140px] flex-shrink-0"
                      >
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          <Icon icon={skill.icon} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                            {skill.name}
                          </h4>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {section.skills.map((skill) => (
                      <div 
                        key={`${skill.name}-2`}
                        className="group relative bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 
                          hover:border-primary/30 hover:bg-card/50 transition-all duration-300 hover:scale-105
                          flex flex-col items-center justify-center text-center space-y-3 h-[120px] w-[140px] flex-shrink-0"
                      >
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          <Icon icon={skill.icon} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                            {skill.name}
                          </h4>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}