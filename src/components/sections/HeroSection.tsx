"use client";

import { SITE_DATA } from "@/config";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-0 bg-background"
    >
      {/* Mouse Follow Effect */}
      <div
        className="from-primary/5 via-primary/10 dark:from-primary/3 dark:via-primary/6 pointer-events-none absolute h-64 w-64 rounded-full bg-gradient-to-r to-transparent blur-3xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transform: `translate3d(0, 0, 0)`,
        }}
      />

      {/* Beautiful Static Background */}
      <div className="via-muted/10 absolute inset-0 bg-gradient-to-br from-background to-background">
        {/* Elegant static orbs */}
        <div
          className="from-accent-foreground/6 via-accent-foreground/3 dark:from-accent-foreground/4 dark:via-accent-foreground/2 animate-pulse-subtle absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-gradient-to-tl to-transparent blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="from-primary/5 dark:from-primary/3 animate-pulse-subtle absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-gradient-to-bl to-transparent blur-2xl"
          style={{ animationDelay: "4s" }}
        />

        {/* Clean grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.022]"
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            color: "var(--foreground)",
          }}
        />

        {/* Elegant light rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="from-primary/20 absolute left-1/2 top-0 h-32 w-px -translate-x-1/2 rotate-12 transform bg-gradient-to-b to-transparent" />
          <div className="from-accent-foreground/15 absolute bottom-0 right-1/3 h-24 w-px rotate-45 transform bg-gradient-to-t to-transparent" />
        </div>

        {/* Floating sparkles - reduced on mobile */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-float absolute hidden sm:block"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            >
              <div className="bg-primary/40 h-1 w-1 animate-ping rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-12 lg:py-4">
          {/* Left side - Text Content */}
          <div className="space-y-6 text-center sm:space-y-8 lg:text-left">
            {/* Animated entrance */}
            <div className="animate-fadeIn space-y-6">
              {/* Creative Title Design */}
              <div className="mx-auto max-w-4xl space-y-8 lg:mx-0">
                {/* Creative Main Title */}
                <div className="relative">
                  <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                    <span className="relative block">
                      <span className="from-foreground to-foreground bg-gradient-to-r via-primary bg-clip-text text-transparent">
                        {SITE_DATA.hero.mainTitle.line1}
                      </span>
                      <div className="to-accent-foreground absolute -right-2 -top-1 h-6 w-6 animate-bounce rounded-full bg-gradient-to-r from-primary opacity-60 sm:-right-4 sm:-top-2 sm:h-8 sm:w-8"></div>
                    </span>
                    <span className="relative mt-1 block sm:mt-2">
                      <span className="via-accent-foreground bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                        {SITE_DATA.hero.mainTitle.line2}
                      </span>
                    </span>
                  </h1>

                  {/* Floating decorative elements around title - responsive */}
                  <div className="absolute -right-4 -top-2 h-2 w-2 animate-ping rounded-full bg-primary opacity-60 sm:-right-8 sm:-top-4 sm:h-3 sm:w-3"></div>
                  <div className="bg-accent-foreground absolute -bottom-1 -left-2 h-3 w-3 animate-pulse rounded-full opacity-40 sm:-bottom-2 sm:-left-4 sm:h-4 sm:w-4"></div>
                  <div className="from-primary/40 animate-float absolute -right-6 top-1/2 hidden h-8 w-2 rounded-full bg-gradient-to-b to-transparent sm:block sm:h-12 lg:-right-12"></div>
                </div>

                {/* Enhanced Description */}
                <div className="relative">
                  <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg md:text-xl lg:mx-0">
                    {
                      SITE_DATA.hero.description.split(
                        SITE_DATA.hero.highlightedTerms.term1,
                      )[0]
                    }
                    <span className="relative inline-block">
                      <span className="text-foreground font-semibold">
                        {SITE_DATA.hero.highlightedTerms.term1}
                      </span>
                      <span className="absolute bottom-0 left-0 block h-0.5 w-full bg-gradient-to-r from-primary to-transparent" />
                    </span>
                    {
                      SITE_DATA.hero.description
                        .split(SITE_DATA.hero.highlightedTerms.term1)[1]
                        .split(SITE_DATA.hero.highlightedTerms.term2)[0]
                    }
                    <span className="relative inline-block">
                      <span className="text-foreground font-semibold">
                        {SITE_DATA.hero.highlightedTerms.term2}
                      </span>
                      <span className="from-accent-foreground absolute bottom-0 left-0 block h-0.5 w-full bg-gradient-to-r to-transparent" />
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced action buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row sm:gap-6 sm:pt-8 lg:justify-start">
              <button
                onClick={() =>
                  scrollToSection(SITE_DATA.hero.buttons.primary.href)
                }
                className="text-primary-foreground hover:shadow-primary/25 focus-ring group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-3 text-base font-semibold shadow-2xl transition-all duration-300 hover:scale-105 sm:w-auto sm:rounded-2xl sm:px-8 sm:py-4"
              >
                <div className="via-accent-foreground absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">
                  {SITE_DATA.hero.buttons.primary.text}
                </span>
              </button>
              <button
                onClick={() =>
                  scrollToSection(SITE_DATA.hero.buttons.secondary.href)
                }
                className="bg-card/50 border-border hover:border-primary/50 focus-ring group relative w-full overflow-hidden rounded-xl border-2 px-6 py-3 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:w-auto sm:rounded-2xl sm:px-8 sm:py-4"
              >
                <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10">
                  {SITE_DATA.hero.buttons.secondary.text}
                </span>
              </button>
            </div>

            {/* Enhanced stats */}
            <div
              className="animate-fadeIn pt-6 sm:pt-8"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:mx-0">
                {SITE_DATA.hero.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card/30 border-border hover:border-primary/30 animate-fadeIn group relative rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:rounded-2xl sm:p-6"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="space-y-1 text-center sm:space-y-2">
                      <div className="text-gradient to-accent-foreground bg-gradient-to-r from-primary bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground text-xs font-medium sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                    <div className="from-primary/5 absolute inset-0 rounded-xl bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating scroll indicator */}
            <div className="animate-float flex justify-center pt-8 lg:justify-start">
              <button
                onClick={() => scrollToSection("#about")}
                className="bg-card/30 border-border hover:border-primary/50 focus-ring group relative rounded-full border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Scroll to about section"
              >
                <svg
                  className="text-muted-foreground group-hover:text-foreground h-8 w-6 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right side - Profile Image */}
          <div
            className="animate-fadeIn relative order-first flex justify-center lg:order-last"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
              {/* Main profile container */}
              <div className="relative">
                {/* Profile image placeholder with beautiful effects */}
                <div className="relative mx-auto h-60 w-60 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                  {/* Rotating border rings */}
                  <div
                    className="border-border/30 absolute inset-0 animate-spin rounded-full border-2"
                    style={{ animationDuration: "20s" }}
                  />
                  <div
                    className="border-border/20 absolute inset-2 animate-spin rounded-full border"
                    style={{
                      animationDuration: "15s",
                      animationDirection: "reverse",
                    }}
                  />

                  {/* Profile image container */}
                  <div className="from-card/80 to-card/40 border-border absolute inset-4 overflow-hidden rounded-full border bg-gradient-to-br shadow-2xl backdrop-blur-sm">
                    {/* Actual profile image */}
                    <img
                      src="/Meghraj.png"
                      alt={`${SITE_DATA.personal.name} - ${SITE_DATA.personal.role}`}
                      className="h-full w-full object-cover object-center"
                    />
                    {/* Subtle overlay for better integration */}
                    <div className="to-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent" />
                  </div>

                  {/* Floating decorative elements - responsive */}
                  <div className="to-accent animate-float absolute -right-4 -top-4 h-8 w-8 rounded-xl bg-gradient-to-br from-primary opacity-80 shadow-lg sm:-right-6 sm:-top-6 sm:h-10 sm:w-10 sm:rounded-2xl lg:h-12 lg:w-12" />
                  <div className="absolute -right-1 top-1/2 h-3 w-3 animate-ping rounded-full bg-primary sm:-right-2 sm:h-4 sm:w-4" />
                  <div
                    className="bg-accent-foreground absolute -left-2 top-1/4 h-2 w-2 animate-ping rounded-full sm:-left-3 sm:h-3 sm:w-3"
                    style={{ animationDelay: "1s" }}
                  />
                </div>

                {/* Background glow */}
                <div className="from-primary/20 to-accent-foreground/20 dark:from-primary/12 dark:to-accent-foreground/12 animate-pulse-subtle absolute inset-0 scale-150 rounded-full bg-gradient-to-r via-transparent blur-3xl" />
              </div>

              {/* Skills badges floating around - responsive */}
              <div className="hidden lg:block">
                {SITE_DATA.hero.floatingSkills.map((skill, index) => {
                  const positions = [
                    { position: "absolute -left-8 top-8", delay: "0s" },
                    { position: "absolute -right-12 top-1/3", delay: "1s" },
                    { position: "absolute -left-12 bottom-1/4", delay: "2s" },
                    { position: "absolute -right-8 bottom-8", delay: "0.5s" },
                  ];
                  return (
                    <div
                      key={skill}
                      className={`animate-float ${positions[index]?.position}`}
                      style={{ animationDelay: positions[index]?.delay }}
                    >
                      <div className="bg-card/70 border-border rounded-lg border px-3 py-1.5 shadow-lg backdrop-blur-sm">
                        <span className="text-sm font-medium">{skill}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile skills badges - horizontal layout */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:hidden">
                {SITE_DATA.hero.floatingSkills
                  .slice(0, 3)
                  .map((skill, index) => (
                    <div
                      key={skill}
                      className="animate-fadeIn bg-card/70 border-border rounded-lg border px-3 py-1.5 shadow-lg backdrop-blur-sm"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <span className="text-xs font-medium">{skill}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles - reduced on mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-primary/20 animate-float absolute hidden h-2 w-2 rounded-full sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
