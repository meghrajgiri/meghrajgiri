"use client";

import { SITE_DATA } from "@/config";

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      {/* Section background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="space-y-20">
          {/* Section Header */}
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">{SITE_DATA.about.badge}</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                {SITE_DATA.about.title}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {SITE_DATA.about.subtitle}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8 animate-slideIn">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-primary to-accent-foreground rounded-full" />
                  <h3 className="text-3xl md:text-4xl font-bold">Full Stack Developer</h3>
                </div>
                
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  {SITE_DATA.about.description.map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Enhanced Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SITE_DATA.about.highlights.map((item, index) => (
                  <div 
                    key={index}
                    className="group relative p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fadeIn"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="space-y-3">
                      <div className="text-2xl">{item.icon}</div>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Visual Element */}
            <div className="relative animate-slideIn" style={{animationDelay: '0.3s'}}>
              <div className="relative">
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-2xl">
                  <div className="space-y-8">
                    {/* Profile section */}
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-primary to-accent-foreground rounded-2xl flex items-center justify-center shadow-lg">
                        <svg 
                          className="w-12 h-12 text-primary-foreground" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xl font-bold mb-2">Clean Code Advocate</div>
                        <div className="text-sm text-muted-foreground">
                          Writing maintainable, testable, and scalable code
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6">
                      {SITE_DATA.about.stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                          <div className="text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
                            {stat.value}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technology icons */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {SITE_DATA.about.technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full border border-border/50 animate-fadeIn"
                          style={{animationDelay: `${index * 0.1 + 0.5}s`}}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent rounded-3xl" />
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl animate-float shadow-lg" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-accent-foreground to-primary rounded-xl animate-float" style={{animationDelay: '0.5s'}} />
                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />

                {/* Background orb */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-xl scale-110 -z-10" />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-8 animate-fadeIn" style={{animationDelay: '0.8s'}}>
            <div className="relative inline-block">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {SITE_DATA.about.callToAction.title}
              </h3>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent-foreground rounded-full" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {SITE_DATA.about.callToAction.description}
            </p>
            <button 
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 focus-ring overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-foreground to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">{SITE_DATA.about.callToAction.buttonText}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}