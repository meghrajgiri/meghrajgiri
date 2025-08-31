"use client";

import { useState, useEffect } from "react";
import { SITE_DATA } from "@/config";

interface LoadingScreenProps {
  children: React.ReactNode;
}

export function LoadingScreen({ children }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the page to fully load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        {/* Background effects */}
        <div className="absolute inset-0">
          {/* Animated gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background" />
          
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl animate-pulse-subtle" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/2 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(var(--border) 1px, transparent 1px),
                linear-gradient(90deg, var(--border) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-accent-foreground rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 animate-pulse">
                <span className="text-xl font-black text-primary-foreground tracking-tight">{SITE_DATA.personal.initials}</span>
              </div>
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {SITE_DATA.personal.name}
            </h1>
            <p className="text-muted-foreground animate-pulse">
              Loading amazing experiences...
            </p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0s'}} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}