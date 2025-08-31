"use client";

import { useEffect, useState } from "react";
import { SITE_DATA } from "@/config";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Beautiful Static Background */}
      <div className="via-muted/10 absolute inset-0 bg-gradient-to-br from-background to-background">
        {/* Elegant static orbs */}
        <div className="from-primary/8 via-primary/4 animate-pulse-subtle absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
        <div
          className="from-accent-foreground/6 via-accent-foreground/3 animate-pulse-subtle absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-gradient-to-tl to-transparent blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="from-primary/5 animate-pulse-subtle absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-gradient-to-bl to-transparent blur-2xl"
          style={{ animationDelay: "4s" }}
        />

        {/* Beautiful geometric patterns */}
        <div
          className="top-1/6 left-1/6 border-primary/10 absolute h-32 w-32 animate-spin rounded-full border opacity-40"
          style={{ animationDuration: "30s" }}
        />
        <div
          className="bottom-1/5 right-1/5 border-accent-foreground/10 absolute h-24 w-24 animate-spin rounded-full border opacity-30"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        />

        {/* Clean grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            color: 'var(--foreground)',
          }}
        />

        {/* Elegant light rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="from-primary/20 absolute left-1/2 top-0 h-32 w-px -translate-x-1/2 rotate-12 transform bg-gradient-to-b to-transparent" />
          <div className="from-accent-foreground/15 absolute bottom-0 right-1/3 h-24 w-px rotate-45 transform bg-gradient-to-t to-transparent" />
          <div className="left-1/5 from-primary/10 absolute top-1/3 h-20 w-px -rotate-12 transform bg-gradient-to-b to-transparent" />
        </div>

        {/* Floating sparkles */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-float absolute"
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
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-12 py-4 lg:grid-cols-2">
          {/* Left side - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Animated entrance */}
            <div className="animate-fadeIn space-y-6">
              {/* Creative Title Design */}
              <div className="mx-auto max-w-4xl space-y-8 lg:mx-0">

                {/* Creative Main Title */}
                <div className="relative">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                    <span className="block relative">
                      <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                        {SITE_DATA.hero.mainTitle.line1}
                      </span>
                      <div className="absolute -right-4 -top-2 w-8 h-8 bg-gradient-to-r from-primary to-accent-foreground rounded-full animate-bounce opacity-60"></div>
                    </span>
                    <span className="block mt-2 relative">
                      <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">
                        {SITE_DATA.hero.mainTitle.line2}
                      </span>
                    </span>
                  </h1>
                  
                  {/* Floating decorative elements around title */}
                  <div className="absolute -top-4 -right-8 w-3 h-3 bg-primary rounded-full animate-ping opacity-60"></div>
                  <div className="absolute -bottom-2 -left-4 w-4 h-4 bg-accent-foreground rounded-full animate-pulse opacity-40"></div>
                  <div className="absolute top-1/2 -right-12 w-2 h-12 bg-gradient-to-b from-primary/40 to-transparent rounded-full animate-float"></div>
                </div>

                {/* Enhanced Description */}
                <div className="relative">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    {SITE_DATA.hero.description.split(SITE_DATA.hero.highlightedTerms.term1)[0]}
                    <span className="relative inline-block">
                      <span className="text-foreground font-semibold">{SITE_DATA.hero.highlightedTerms.term1}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent block" />
                    </span>
                    {SITE_DATA.hero.description.split(SITE_DATA.hero.highlightedTerms.term1)[1].split(SITE_DATA.hero.highlightedTerms.term2)[0]}
                    <span className="relative inline-block">
                      <span className="text-foreground font-semibold">{SITE_DATA.hero.highlightedTerms.term2}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-foreground to-transparent block" />
                    </span>
                  </p>
                  
                </div>

              </div>
            </div>

            {/* Enhanced action buttons */}
            <div className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row lg:justify-start">
              <button
                onClick={() => scrollToSection(SITE_DATA.hero.buttons.primary.href)}
                className="text-primary-foreground hover:shadow-primary/25 focus-ring group relative overflow-hidden rounded-2xl bg-primary px-6 py-3 text-base font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="via-accent-foreground absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">{SITE_DATA.hero.buttons.primary.text}</span>
              </button>
              <button
                onClick={() => scrollToSection(SITE_DATA.hero.buttons.secondary.href)}
                className="bg-card/50 border-border hover:border-primary/50 focus-ring group relative overflow-hidden rounded-2xl border-2 px-6 py-3 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10">{SITE_DATA.hero.buttons.secondary.text}</span>
              </button>
            </div>

            {/* Enhanced stats */}
            <div
              className="animate-fadeIn pt-8"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-3 lg:mx-0">
                {SITE_DATA.hero.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card/30 border-border/50 hover:border-primary/30 animate-fadeIn group relative rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="space-y-2 text-center">
                      <div className="text-gradient to-accent-foreground bg-gradient-to-r from-primary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground text-sm font-medium">
                        {stat.label}
                      </div>
                    </div>
                    <div className="from-primary/5 absolute inset-0 rounded-2xl bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating scroll indicator */}
            <div className="animate-float flex justify-center pt-8 lg:justify-start">
              <button
                onClick={() => scrollToSection("#about")}
                className="bg-card/30 border-border/50 hover:border-primary/50 focus-ring group relative rounded-full border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-110"
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
            className="animate-fadeIn relative hidden lg:flex"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative mx-auto w-full max-w-md">
              {/* Main profile container */}
              <div className="relative">
                {/* Profile image placeholder with beautiful effects */}
                <div className="relative mx-auto h-80 w-80">
                  {/* Rotating border rings */}
                  <div
                    className="border-primary/20 absolute inset-0 animate-spin rounded-full border-2"
                    style={{ animationDuration: "20s" }}
                  />
                  <div
                    className="border-accent-foreground/15 absolute inset-2 animate-spin rounded-full border"
                    style={{
                      animationDuration: "15s",
                      animationDirection: "reverse",
                    }}
                  />

                  {/* Profile image container */}
                  <div className="from-card/80 to-card/40 border-border/50 absolute inset-4 overflow-hidden rounded-full border bg-gradient-to-br shadow-2xl backdrop-blur-sm">
                    {/* Actual profile image */}
                    <img
                      src="/Meghraj.png"
                      alt={`${SITE_DATA.personal.name} - ${SITE_DATA.personal.role}`}
                      className="h-full w-full object-cover object-center"
                    />
                    {/* Subtle overlay for better integration */}
                    <div className="to-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent" />
                  </div>

                  {/* Floating decorative elements */}
                  <div className="to-accent animate-float absolute -right-6 -top-6 h-12 w-12 rounded-2xl bg-gradient-to-br from-primary opacity-80 shadow-lg" />
                  <div className="absolute -right-2 top-1/2 h-4 w-4 animate-ping rounded-full bg-primary" />
                  <div
                    className="bg-accent-foreground absolute -left-3 top-1/4 h-3 w-3 animate-ping rounded-full"
                    style={{ animationDelay: "1s" }}
                  />
                </div>

                {/* Background glow */}
                <div className="from-primary/20 to-accent-foreground/20 animate-pulse-subtle absolute inset-0 scale-150 rounded-full bg-gradient-to-r via-transparent blur-3xl" />
              </div>

              {/* Skills badges floating around */}
              {SITE_DATA.hero.floatingSkills.map((skill, index) => {
                const positions = [
                  { position: "absolute -left-8 top-8", delay: "0s" },
                  { position: "absolute -right-12 top-1/3", delay: "1s" },
                  { position: "absolute -left-12 bottom-1/4", delay: "2s" },
                  { position: "absolute -right-8 bottom-8", delay: "0.5s" }
                ];
                return (
                  <div
                    key={skill}
                    className={`animate-float ${positions[index]?.position}`}
                    style={{ animationDelay: positions[index]?.delay }}
                  >
                    <div className="bg-card/70 border-border/50 rounded-lg border px-3 py-1.5 shadow-lg backdrop-blur-sm">
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-primary/20 animate-float absolute h-2 w-2 rounded-full"
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
