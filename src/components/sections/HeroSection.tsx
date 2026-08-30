"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { Terminal } from "@/components/sections/Terminal";

/**
 * Editorial hero: a single strong type column with the portrait as a supporting
 * element rather than a co-equal one.
 *
 * The previous version centred a yellow-filled portrait circle opposite the headline,
 * which fought the accent colour for attention. Here the portrait is squared, held by
 * a hairline, and given no fill of its own — so the only saturated colour on the page
 * is the accent, and it always means something.
 */
export function HeroSection() {
  const { hero, personal, contact } = useSiteConfig();
  if (!hero) return null;

  const { mainTitle, description, highlightedTerms, buttons, floatingSkills } = hero;

  // Bold the two terms the config singles out, without dropping the rest of the
  // sentence. Falls back to plain text when a term is missing.
  const lede = () => {
    const terms = [highlightedTerms?.term1, highlightedTerms?.term2].filter(Boolean) as string[];
    if (!terms.length) return description;
    const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
    return description.split(pattern).map((part, i) =>
      terms.includes(part) ? (
        <span key={i} className="font-medium text-foreground underline decoration-brand decoration-2 underline-offset-[5px]">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <section className="relative px-6 pb-10 pt-14 md:pb-12 md:pt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-start gap-10 md:gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground sm:text-[11px] sm:tracking-[0.16em]">
              {personal?.role ?? "Full stack developer"} &middot; {personal?.location ?? "Remote"}
            </p>

            <h1 className="mt-6 text-[2.6rem] leading-[1.04] sm:text-5xl md:text-6xl lg:text-7xl">
              {mainTitle?.line1}
              <span className="block text-muted-foreground">{mainTitle?.line2}</span>
            </h1>

            <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-muted-foreground md:mt-8 md:text-xl">
              {lede()}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-10">
              {buttons?.primary && (
                <Link
                  href={buttons.primary.href}
                  className="focus-ring inline-flex min-h-[48px] items-center rounded-sm bg-primary px-7 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {buttons.primary.text}
                </Link>
              )}
              {contact?.socialLinks?.find((l) => l.platform === "github")?.url && (
                <a
                  href={contact.socialLinks.find((l) => l.platform === "github")!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                >
                  GitHub
                </a>
              )}
              {contact?.availability?.status && (
                <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="h-[7px] w-[7px] rounded-full bg-brand" aria-hidden />
                  {contact.availability.status}
                </span>
              )}
            </div>
          </div>

          <div className="lg:pt-2">
            <Terminal />
            {floatingSkills && floatingSkills.length > 0 && (
              <p className="mt-4 font-mono text-[11px] leading-relaxed tracking-wide text-muted-foreground">
                {floatingSkills.join(" · ")}
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
