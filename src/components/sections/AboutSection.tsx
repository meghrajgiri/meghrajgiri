"use client";

import { SITE_DATA } from "@/config";
import { useEffect, useRef, useState } from "react";

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "journey" | "education"
  >("overview");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: "👋" },
    { id: "journey", label: "Journey", icon: "🚀" },
    { id: "education", label: "Education", icon: "🎓" },
  ] as const;

  const experiences = SITE_DATA.experience.experiences;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-slate-50/50 px-4 pb-16 pt-12 dark:bg-slate-100/5 sm:px-6 sm:pb-20 sm:pt-16 md:pb-24 md:pt-20 lg:pb-32 lg:pt-24"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="bg-primary/20 absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full blur-3xl sm:left-20 sm:top-20 sm:h-48 sm:w-48 md:h-64 md:w-64" />
        <div
          className="bg-accent/15 absolute bottom-10 right-10 h-48 w-48 animate-pulse rounded-full blur-3xl sm:bottom-20 sm:right-20 sm:h-72 sm:w-72 md:h-96 md:w-96"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="from-primary/10 to-accent/10 absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r blur-3xl sm:h-60 sm:w-60 md:h-72 md:w-72"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`mb-8 text-center transition-all duration-1000 sm:mb-12 md:mb-16 ${isVisible ? "animate-fadeIn" : "translate-y-8 opacity-0"}`}
        >
          <div className="bg-primary/10 dark:bg-primary/5 border-primary/20 dark:border-primary/10 mb-4 inline-flex items-center rounded-full border px-4 py-2 backdrop-blur-sm sm:mb-6 sm:px-6 sm:py-3">
            <span className="mr-2 text-sm font-medium text-primary">✨</span>
            <span className="text-xs font-medium text-primary sm:text-sm">
              {SITE_DATA.about.badge}
            </span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text px-4 text-3xl font-bold text-transparent sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            {SITE_DATA.about.title}
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:text-2xl">
            {SITE_DATA.about.subtitle}
          </p>
        </div>

        {/* Interactive Tab Navigation */}
        <div
          className={`mb-8 flex justify-center transition-all delay-200 duration-1000 sm:mb-12 ${isVisible ? "animate-fadeIn" : "translate-y-8 opacity-0"}`}
        >
          <div className="bg-card/50 flex w-full overflow-x-auto rounded-lg border border-border p-1 backdrop-blur-xl sm:w-auto sm:rounded-2xl">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 items-center justify-center space-x-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-all duration-300 sm:flex-none sm:space-x-3 sm:rounded-xl sm:px-6 sm:py-4 sm:text-base md:px-8 md:py-4 ${
                  activeTab === tab.id
                    ? "dark:to-primary/80 bg-slate-800 text-white shadow-md dark:bg-gradient-to-r dark:from-primary"
                    : "hover:bg-muted/50 text-slate-600 hover:text-foreground dark:text-muted-foreground"
                } ${index > 0 ? "border-border/50 border-l" : ""}`}
              >
                <span className="text-sm sm:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="text-xs font-medium sm:hidden">
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className="from-primary/10 to-primary/5 absolute inset-0 -z-10 rounded-md bg-gradient-to-r blur-sm sm:rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div
          className={`transition-all delay-500 duration-700 ${isVisible ? "animate-fadeIn" : "translate-y-8 opacity-0"}`}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
              {/* Content */}
              <div className="space-y-4 sm:space-y-6">
                {SITE_DATA.about.description.map((paragraph, index) => (
                  <p
                    key={index}
                    className="px-4 text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Stats Cards */}
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:gap-6">
                {SITE_DATA.about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="from-card/80 to-card/40 hover:border-primary/30 group rounded-xl border border-border bg-gradient-to-br p-4 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 sm:rounded-2xl sm:p-6"
                  >
                    <div className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-2xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-xs font-medium text-muted-foreground sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Journey Tab */}
          {activeTab === "journey" && (
            <div className="mx-auto max-w-6xl">
              <div className="space-y-8 sm:space-y-12">
                {/* Career Path Header */}
                <div className="space-y-3 px-4 text-center sm:space-y-4">
                  <div className="from-primary/10 to-accent/10 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 sm:px-6 sm:py-3">
                    <span className="text-base sm:text-lg">🚀</span>
                    <span className="text-xs font-medium sm:text-sm">
                      4+ Years of Professional Experience
                    </span>
                  </div>
                  <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                    From crafting responsive web interfaces to building
                    cross-platform mobile applications
                  </p>
                </div>

                {/* Experience Cards Grid */}
                <div className="grid grid-cols-1 gap-4 px-4 sm:gap-6 md:grid-cols-2 md:gap-8">
                  {experiences.map((experience, index) => (
                    <div
                      key={index}
                      className={`from-card/60 to-card/30 hover:border-primary/30 group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-6 transition-all duration-500 hover:scale-105 sm:rounded-3xl sm:p-8 ${
                        experience.status === "current"
                          ? "border-primary/20 shadow-primary/10 border-2 shadow-lg"
                          : ""
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Current Role Badge */}
                      {experience.status === "current" && (
                        <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                          <div className="animate-pulse rounded-full bg-gradient-to-r from-primary to-accent-foreground px-2 py-1 text-xs font-bold text-primary-foreground sm:px-3 sm:py-1">
                            CURRENT
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
                        <div
                          className={`h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${
                            experience.status === "current"
                              ? "animate-pulse bg-gradient-to-r from-primary to-accent-foreground"
                              : "bg-muted-foreground/50"
                          }`}
                        />
                        <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                          {experience.year} - {experience.period}
                        </div>
                      </div>

                      {/* Company & Role */}
                      <div className="mb-4 space-y-2 sm:mb-6 sm:space-y-3">
                        <h3 className="text-lg font-bold transition-colors duration-300 group-hover:text-primary sm:text-xl md:text-2xl">
                          {experience.title}
                        </h3>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                          <span className="text-base font-semibold text-foreground sm:text-lg">
                            {experience.company}
                          </span>
                          <span className="bg-muted-foreground/30 hidden h-1.5 w-1.5 rounded-full sm:block" />
                          <span className="text-xs text-muted-foreground sm:text-sm">
                            {experience.type}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-6 sm:text-base">
                        {experience.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-muted/70 hover:border-primary/30 hover:bg-primary/5 rounded-full border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-all duration-300 hover:text-primary sm:px-3 sm:py-1"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Decorative Elements */}
                      <div className="from-primary/5 absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-16 sm:w-16" />
                      <div className="from-accent/10 absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-8 sm:w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="mx-auto max-w-5xl">
              <div className="space-y-8 sm:space-y-12">
                {/* Education Header */}
                <div className="space-y-3 px-4 text-center sm:space-y-4">
                  <div className="from-primary/10 to-accent/10 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 sm:px-6 sm:py-3">
                    <span className="text-base sm:text-lg">🎓</span>
                    <span className="text-xs font-medium sm:text-sm">
                      {SITE_DATA.education.title}
                    </span>
                  </div>
                  <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                    {SITE_DATA.education.subtitle}
                  </p>
                </div>

                {/* Education Cards */}
                <div className="space-y-4 px-4 sm:space-y-8">
                  {SITE_DATA.education.education.map((education, index) => (
                    <div
                      key={education.id}
                      className="from-card/60 to-card/30 hover:border-primary/30 group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br p-4 transition-all duration-500 hover:scale-105 sm:rounded-3xl sm:p-8"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Institution Logo & Period */}
                      <div className="mb-3 flex items-start gap-3 sm:mb-6 sm:gap-6">
                        <div className="flex-shrink-0">
                          <div className="from-primary/10 to-accent/10 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-gradient-to-br text-base sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl">
                            {education.logo}
                          </div>
                        </div>
                        <div className="flex-1 pr-12 sm:pr-0">
                          <div className="mb-1 flex items-center gap-2 sm:mb-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent-foreground sm:h-3 sm:w-3" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {education.period.split(" - ")[1]}{" "}
                              {/* Show only end year on mobile */}
                            </span>
                          </div>
                          <h3 className="mb-1 text-base font-bold leading-tight transition-colors duration-300 group-hover:text-primary sm:mb-2 sm:text-xl">
                            {education.degree}
                          </h3>
                          <p className="text-xs leading-tight text-muted-foreground sm:text-sm">
                            {education.field}
                          </p>
                          {/* Mobile Type Badge */}
                          <div className="mt-2 sm:hidden">
                            <div className="bg-primary/10 inline-block rounded-full px-2 py-1 text-xs font-medium text-primary">
                              {education.type}
                            </div>
                          </div>
                        </div>
                        {/* Desktop Type Badge */}
                        <div className="absolute right-6 top-6 hidden sm:block">
                          <div className="bg-primary/10 rounded-full px-3 py-1 text-xs font-medium text-primary">
                            {education.type}
                          </div>
                        </div>
                      </div>

                      {/* Description - Hidden on mobile */}
                      <p className="mb-6 hidden text-base leading-relaxed text-muted-foreground sm:block">
                        {education.description}
                      </p>

                      {/* Skills/Technologies Learned - Simplified on mobile */}
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {education.skills
                            .slice(0, 4)
                            .map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-muted/70 rounded-full border border-border px-2 py-1 text-xs font-medium text-muted-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          {education.skills.length > 4 && (
                            <span className="bg-muted/70 rounded-full border border-border px-2 py-1 text-xs font-medium text-muted-foreground">
                              +{education.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Decorative Elements - Smaller on mobile */}
                      <div className="from-primary/5 absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-20 sm:w-20" />
                      <div className="from-accent/10 absolute -left-1 -top-1 h-4 w-4 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-10 sm:w-10" />
                    </div>
                  ))}
                </div>

                {/* Academic Achievement Summary */}
                <div className="mt-12 space-y-4 px-4 text-center sm:mt-16 sm:space-y-6">
                  <h3 className="text-lg font-semibold sm:text-xl">
                    Academic Highlights
                  </h3>
                  <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                    {SITE_DATA.education.highlights.map((highlight, index) => (
                      <div key={index} className="space-y-2">
                        <div className="text-xl font-bold text-primary sm:text-2xl">
                          {highlight.value}
                        </div>
                        <div className="text-xs text-muted-foreground sm:text-sm">
                          {highlight.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div
          className={`mt-12 px-4 text-center transition-all delay-700 duration-1000 sm:mt-16 ${isVisible ? "animate-fadeIn" : "translate-y-8 opacity-0"}`}
        >
          <div className="relative inline-block">
            <h3 className="mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-2xl font-bold text-transparent sm:mb-4 sm:text-3xl">
              {SITE_DATA.about.callToAction.title}
            </h3>
          </div>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mb-8 sm:text-lg">
            {SITE_DATA.about.callToAction.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:shadow-primary/25 group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent-foreground px-6 py-3 text-sm font-semibold text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 sm:w-auto sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-foreground to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {SITE_DATA.about.callToAction.buttonText}
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
            <button
              onClick={() => {
                const element = document.querySelector("#projects");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-card/50 hover:border-primary/50 group relative w-full overflow-hidden rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:w-auto sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
            >
              <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                View My Work
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
