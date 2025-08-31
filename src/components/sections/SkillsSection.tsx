"use client";

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 88 },
        { name: "Tailwind CSS", level: 92 },
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Python", level: 80 },
        { name: "PostgreSQL", level: 82 },
        { name: "MongoDB", level: 78 },
      ]
    },
    {
      title: "Tools & Cloud",
      skills: [
        { name: "AWS", level: 75 },
        { name: "Docker", level: 80 },
        { name: "Git", level: 90 },
        { name: "Figma", level: 85 },
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">Skills & Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div key={category.title} className="space-y-6">
                <h3 className="text-xl font-semibold text-center">{category.title}</h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${skill.level}%`,
                            animationDelay: `${(categoryIndex * category.skills.length + skillIndex) * 0.1}s`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Skills */}
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-semibold">Additional Skills</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                "GraphQL", "REST APIs", "Microservices", "Testing (Jest, Cypress)",
                "State Management (Redux, Zustand)", "Performance Optimization",
                "SEO", "Accessibility", "Agile/Scrum", "Code Review",
                "Mentoring", "Technical Writing"
              ].map((skill, index) => (
                <span 
                  key={skill}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover-lift cursor-default"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-subtle rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold mb-4">Ready to work together?</h3>
            <p className="text-muted-foreground mb-6">
              Let&apos;s discuss how these skills can help bring your project to life
            </p>
            <button 
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 bg-gradient text-primary-foreground rounded-lg font-semibold hover-lift focus-ring"
            >
              Start a Conversation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}