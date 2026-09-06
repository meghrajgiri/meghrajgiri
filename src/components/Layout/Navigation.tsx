"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * Site header, designed at phone width first.
 *
 * The previous version was a floating pill that grew a shadow on scroll and hid its
 * menu button behind a `md:` breakpoint — at 390px it rendered as a bare logo with no
 * way to navigate at all. This is a plain sticky bar: a hairline rule instead of a
 * shadow, a real drawer on small screens, and 48px minimum targets throughout.
 *
 * The bar is opaque rather than blurred on purpose. A translucent header over a near
 * black ground has nothing to frost, and backdrop-filter on a sticky element repaints
 * on every scroll frame for an effect nobody would see.
 *
 * `px-6` sits on the <header>, outside the container, not inside it. Every page
 * section pads the outer element and centres a `max-w-6xl` container within it, so
 * padding the container instead shrank the header's content to 1104px against the
 * page's 1152px — the logo sat 24px inboard of the hero panel directly beneath it.
 */
export function Navigation() {
  const { navigation, personal, contact } = useSiteConfig();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // A drawer that leaves the page scrollable behind it feels broken on a phone.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = navigation?.items ?? [];
  const github = contact?.socialLinks?.find(
    (l) => l.platform === "github",
  )?.url;
  const availability = contact?.availability?.status;

  const ThemeToggle = ({ className = "" }: { className?: string }) => (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      // Also gated on `mounted`. The server cannot know the visitor's theme, so
      // `resolvedTheme` is undefined there and settled on the client — rendering the
      // specific label straight away made the two disagree and failed hydration. The
      // icon was already guarded; the label was not.
      aria-label={
        mounted
          ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`
          : "Toggle theme"
      }
      className={`panel panel-i focus-ring flex h-11 w-11 items-center justify-center bg-card text-foreground ${className}`}
    >
      {/* Rendered only after mount: the server cannot know the visitor's theme, and
          guessing produces a hydration mismatch and a flash of the wrong icon. */}
      {mounted && (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden
        >
          {resolvedTheme === "dark" ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path
                strokeLinecap="round"
                d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
              />
            </>
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
            />
          )}
        </svg>
      )}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background px-6">
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 py-3.5">
          <Link
            href="/"
            className="focus-ring flex min-w-0 items-center gap-3 rounded-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-brand font-mono text-[11px] font-bold text-brand-ink">
              {personal?.initials ?? "MG"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold leading-tight">
                {personal?.name ?? "Meghraj Giri"}
              </span>
              {/* Availability sits here rather than in the hero: it is the one fact
                  worth carrying on every page, and it stays in view as you scroll. */}
              {availability ? (
                <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:flex">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-foreground"
                    aria-hidden
                  />
                  <span className="truncate">{availability}</span>
                </span>
              ) : (
                <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
                  {personal?.role}
                </span>
              )}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring text-[15px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile (opens in a new tab)"
                className="panel panel-i focus-ring hidden h-11 w-11 items-center justify-center bg-card text-foreground sm:flex"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 .5a11.5 11.5 0 00-3.64 22.42c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.400-3.88-1.4-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.08.79 2.18v3.23c0 .3.21.66.8.55A11.5 11.5 0 0012 .5z" />
                </svg>
              </a>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="panel panel-i focus-ring flex h-11 w-11 items-center justify-center bg-card text-foreground lg:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                {open ? (
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer. Full-height and opaque so the page behind never shows through mid-scroll. */}
      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-[65px] z-40 bg-background px-6 lg:hidden"
        >
          <nav
            className="container mx-auto flex max-w-6xl flex-col py-2"
            aria-label="Primary mobile"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring flex min-h-[60px] items-center border-b border-border text-2xl font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="focus-ring flex min-h-[60px] items-center border-b border-border text-2xl font-semibold"
            >
              All projects
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
