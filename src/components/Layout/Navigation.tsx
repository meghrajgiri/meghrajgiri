"use client";

import { SITE_DATA } from "@/config";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setIsOnHeroSection] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      // Check if we're on hero section (roughly first screen height)
      setIsOnHeroSection(window.scrollY < window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // No scroll locking needed for dropdown menu

  const navItems = SITE_DATA.navigation.items;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  if (!mounted) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 h-16">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="bg-muted/50 h-8 w-32 animate-pulse rounded" />
          <div className="flex space-x-4">
            <div className="bg-muted/50 h-8 w-20 animate-pulse rounded" />
            <div className="bg-muted/50 h-10 w-10 animate-pulse rounded-lg" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-500 ${
        isScrolled ? "top-0 px-6 py-3 md:py-4" : "top-0"
      }`}
    >
      <nav
        className={`container mx-auto flex items-center justify-between px-6 transition-all duration-500 ${
          isScrolled
            ? "border-border h-16 rounded-xl border bg-background py-3 shadow-lg md:h-20 md:py-6"
            : "h-20"
        }`}
      >
        {/* Professional Logo */}
        <div
          className="group flex cursor-pointer items-center space-x-4"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative">
            <div className="via-primary/90 to-accent-foreground shadow-primary/20 group-hover:shadow-primary/40 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary shadow-2xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
              <span className="text-primary-foreground text-lg font-black tracking-tight">
                {SITE_DATA.personal.initials}
              </span>
            </div>
            {/* Professional status indicator */}
            <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
              <div className="bg-white h-1.5 w-1.5 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="hidden space-y-1 sm:block">
            <div className="text-foreground text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-primary">
              {SITE_DATA.personal.name}
            </div>
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {SITE_DATA.personal.role}
            </div>
          </div>
        </div>

        {/* Professional Desktop Navigation */}
        <div className="hidden items-center space-x-2 md:flex">
          {navItems.map((item, index) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="text-muted-foreground/80 hover:text-foreground hover:bg-card/50 hover:border-border/30 group relative rounded-2xl border border-transparent px-5 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="relative z-10 tracking-wide">{item.label}</span>
              <div className="from-primary/5 via-primary/10 to-accent-foreground/5 absolute inset-0 scale-95 rounded-2xl bg-gradient-to-r opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
              <div className="to-accent-foreground absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r from-primary transition-all duration-300 group-hover:w-8" />
            </button>
          ))}
        </div>

        {/* Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Professional Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-card/40 border-border/30 hover:border-primary/30 hover:bg-card/60 focus-ring group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-xl"
            aria-label="Toggle theme"
          >
            <div className="from-primary/5 via-primary/10 to-accent-foreground/5 absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-all duration-500 group-hover:opacity-100" />
            <div className="relative z-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              {theme === "dark" ? (
                <svg
                  className="h-4 w-4 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </div>
            <div className="group-hover:ring-primary/20 absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-300" />
          </button>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-muted/50 hover:bg-muted focus-ring group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 md:hidden"
            aria-label="Toggle mobile menu"
          >
            <div className="from-primary/10 to-accent/10 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 transition-transform duration-300">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* Dropdown Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {/* Background overlay (optional - for closing when clicking outside) */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 999 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Blurry Dropdown Menu */}
          <div
            className="bg-background/90 border-border/30 absolute left-0 right-0 top-full border-b shadow-2xl backdrop-blur-xl"
            style={{ zIndex: 1000 }}
          >
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    scrollToSection("#about");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground bg-card/20 hover:bg-card/40 border-border/20 hover:border-primary/30 block w-full rounded-xl border px-6 py-4 text-left font-medium backdrop-blur-sm transition-all duration-300 hover:text-primary"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/60 h-2 w-2 rounded-full opacity-60" />
                    <span>About</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    scrollToSection("#skills");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground bg-card/20 hover:bg-card/40 border-border/20 hover:border-primary/30 block w-full rounded-xl border px-6 py-4 text-left font-medium backdrop-blur-sm transition-all duration-300 hover:text-primary"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/60 h-2 w-2 rounded-full opacity-60" />
                    <span>Skills</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    scrollToSection("#projects");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground bg-card/20 hover:bg-card/40 border-border/20 hover:border-primary/30 block w-full rounded-xl border px-6 py-4 text-left font-medium backdrop-blur-sm transition-all duration-300 hover:text-primary"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/60 h-2 w-2 rounded-full opacity-60" />
                    <span>Projects</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    scrollToSection("#contact");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground bg-card/20 hover:bg-card/40 border-border/20 hover:border-primary/30 block w-full rounded-xl border px-6 py-4 text-left font-medium backdrop-blur-sm transition-all duration-300 hover:text-primary"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/60 h-2 w-2 rounded-full opacity-60" />
                    <span>Contact</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
