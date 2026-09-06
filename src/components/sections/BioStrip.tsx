"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * A short bio, not a spread.
 *
 * The home page previously carried the full editorial About section — heading,
 * subtitle, four paragraphs, a stats rail and its own call to action — which is the
 * entire contents of `/about` rendered a second time. On a developer portfolio that
 * space belongs to the work, and duplicating a page verbatim gives a visitor no
 * reason to visit it. `/about` still renders the full `AboutSection`, unchanged.
 *
 * Laid out as two columns that both carry text, rather than a text column beside a
 * bottom-floated button. The earlier arrangement put the lede on the left and a lone
 * "More about me" pinned to the bottom-right, which left the entire top-right of the
 * band empty and made the button read as though it had drifted there. The lede and
 * the supporting paragraph now sit side by side at different weights, and the actions
 * close the second column where the reading ends.
 */
export function BioStrip() {
  const { about, experience, education } = useSiteConfig();
  if (!about) return null;

  const paragraphs = Array.isArray(about.description) ? about.description : [];
  const lede = about.subtitle ?? paragraphs[0];
  if (!lede) return null;

  // When there is no second paragraph the supporting column would be empty, so the
  // first one moves across rather than leaving a hole where the old button sat.
  const support = about.subtitle ? paragraphs[0] : paragraphs[1];

  const years = experience?.experiences?.length ?? 0;
  const schools = education?.education?.length ?? 0;

  const metaLink =
    "focus-ring font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground";

  return (
    <section id="about" className="band px-6 py-14 md:py-20">
      <div className="container mx-auto max-w-6xl">
        <p className="label">{about.badge ?? "About"}</p>

        <div className="mt-6 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-start">
          <p className="max-w-[26ch] text-[1.5rem] leading-[1.28] text-foreground md:text-[1.9rem]">
            {lede}
          </p>

          <div>
            {support && (
              <p className="max-w-[58ch] text-[16px] leading-[1.75] text-muted-foreground">
                {support}
              </p>
            )}

            {/* The numbers link to the pages that evidence them rather than asserting
                them in place — the reasoning that put these in the old About rail. */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/about"
                className="cta-ghost focus-ring inline-flex min-h-[44px] items-center px-5 text-[15px]"
              >
                More about me
              </Link>
              {years > 0 && (
                <Link href="/experience" className={metaLink}>
                  {years} roles
                </Link>
              )}
              {schools > 0 && (
                <Link href="/about#education" className={metaLink}>
                  {schools} qualifications
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
