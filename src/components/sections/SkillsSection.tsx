"use client";

import { SITE_DATA } from "@/config";

export function SkillsSection() {
  const skillSections = [
    {
      title: "Frontend",
      icon: "🎨",
      description: "Modern UI/UX development",
      skills: [
        { name: "React", icon: "⚛️" },
        { name: "Next.js", icon: "▲" },
        { name: "TypeScript", icon: "📘" },
        { name: "Tailwind CSS", icon: "💨" },
        { name: "JavaScript", icon: "🟨" },
        { name: "Vue.js", icon: "💚" },
        { name: "CSS3", icon: "🎨" },
        { name: "HTML5", icon: "📄" }
      ]
    },
    {
      title: "Backend",
      icon: "⚙️",
      description: "Scalable server solutions",
      skills: [
        { name: "Node.js", icon: "🟢" },
        { name: "Python", icon: "🐍" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "MongoDB", icon: "🍃" },
        { name: "Express.js", icon: "🚂" },
        { name: "FastAPI", icon: "⚡" },
        { name: "Redis", icon: "🔴" },
        { name: "GraphQL", icon: "🔗" }
      ]
    },
    {
      title: "Tools & Cloud",
      icon: "☁️",
      description: "Development & deployment tools",
      skills: [
        { name: "AWS", icon: "📦" },
        { name: "Docker", icon: "🐳" },
        { name: "Git", icon: "🌿" },
        { name: "Figma", icon: "🎨" },
        { name: "Vercel", icon: "▲" },
        { name: "VS Code", icon: "💙" },
        { name: "Postman", icon: "📮" },
        { name: "Kubernetes", icon: "☸️" }
      ]
    },
    {
      title: "Other Skills",
      icon: "✨",
      description: "APIs, testing & optimization",
      skills: [
        { name: "REST APIs", icon: "🔌" },
        { name: "Testing", icon: "✅" },
        { name: "Performance", icon: "⚡" },
        { name: "SEO", icon: "🔍" },
        { name: "Accessibility", icon: "♿" },
        { name: "CI/CD", icon: "🔄" },
        { name: "Monitoring", icon: "📊" },
        { name: "Security", icon: "🔒" }
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
                    <div className="text-2xl">{section.icon}</div>
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
                          {skill.icon}
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
                          {skill.icon}
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