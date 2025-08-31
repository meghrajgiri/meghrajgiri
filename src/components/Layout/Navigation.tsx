"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SITE_DATA } from "@/config";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="w-32 h-8 bg-muted/50 rounded animate-pulse" />
          <div className="flex space-x-4">
            <div className="w-20 h-8 bg-muted/50 rounded animate-pulse" />
            <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-2xl border-b border-border/30 shadow-xl shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Professional Logo */}
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-accent-foreground rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-xl font-black text-primary-foreground tracking-tight">{SITE_DATA.personal.initials}</span>
            </div>
            {/* Professional status indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div className="space-y-1 hidden sm:block">
            <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
              {SITE_DATA.personal.name}
            </div>
            <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
              {SITE_DATA.personal.role}
            </div>
          </div>
        </div>

        {/* Professional Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item, index) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="relative px-5 py-3 text-muted-foreground/80 hover:text-foreground transition-all duration-300 font-semibold text-sm rounded-2xl hover:bg-card/50 backdrop-blur-sm group border border-transparent hover:border-border/30"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <span className="relative z-10 tracking-wide">{item.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-accent-foreground/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent-foreground group-hover:w-8 transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Professional Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-12 h-12 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-500 flex items-center justify-center focus-ring group overflow-hidden shadow-lg hover:shadow-xl"
            aria-label="Toggle theme"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-accent-foreground/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
            <div className="relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300" />
          </button>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-11 h-11 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 flex items-center justify-center focus-ring group overflow-hidden"
            aria-label="Toggle mobile menu"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 transition-transform duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-xl animate-slideIn">
          <div className="container mx-auto px-6 py-6 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="group relative w-full text-left p-4 text-muted-foreground hover:text-foreground transition-all duration-300 font-medium rounded-xl hover:bg-muted/30 animate-fadeIn"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{item.label}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </button>
            ))}
            
            {/* Mobile menu footer */}
            <div className="pt-4 mt-4 border-t border-border/50">
              <div className="text-center text-sm text-muted-foreground">
                {SITE_DATA.navigation.mobileMenu.footer}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}