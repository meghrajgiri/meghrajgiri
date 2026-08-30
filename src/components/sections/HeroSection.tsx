"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { Terminal } from "@/components/sections/Terminal";

/**
 * Bento hero: identity, shell and facts as tiles in one composition.
 *
 * The terminal previously sat beside the hero as a slab, which read as pasted on. As a
 * tile among tiles it belongs to the layout instead of interrupting it.
 *
 * The grid is the enhancement, not the base — on a phone every tile is full width and
 * stacks in reading order, so the composition degrades to a sensible column rather
 * than a squeezed grid.
 */
export function HeroSection() {
  const { hero, personal, contact, projects } = useSiteConfig();
  if (!hero) return null;

  const { mainTitle, description, highlightedTerms, buttons, floatingSkills } = hero;
  const shipped = (projects?.projects ?? []).filter((p) => p.published !== false).length;
  const github = contact?.socialLinks?.find((l) => l.platform === "github")?.url;

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

  const tile = "nb bg-card p-6 md:p-7";

  return (
    <section className="px-6 pb-10 pt-10 md:pb-12 md:pt-14">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-4 md:gap-5">
          {/* Identity — the anchor tile */}
          <div className={`${tile} flex flex-col md:col-span-2 md:row-span-2`}>
            <div>
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                {personal?.role ?? "Full stack developer"} &middot; {personal?.location ?? "Remote"}
              </p>
              <h1 className="mt-5 text-[2.4rem] leading-[1.03] sm:text-5xl lg:text-[3.4rem]">
                {mainTitle?.line1}
                <span className="block text-muted-foreground">{mainTitle?.line2}</span>
              </h1>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {lede()}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              {buttons?.primary && (
                <Link
                  href={buttons.primary.href}
                  className="nb nb-press focus-ring inline-flex min-h-[48px] items-center bg-brand px-6 font-bold text-[var(--brand-ink)]"
                >
                  {buttons.primary.text}
                </Link>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Shell — a tile, not a slab */}
          <div className="md:col-span-2">
            <Terminal />
          </div>

          {/* Portrait. The disc behind it samples at #F5CC4C — one green step and
              sixteen blue from tuscan_sun, so it reads as the accent rather than as a
              second colour competing with it. */}
          <div className="nb relative aspect-[5/6] overflow-hidden bg-brand md:aspect-auto">
            <Image
              src="/Meghraj.jpg"
              alt={personal?.name ? `${personal.name}, ${personal.role}` : "Portrait"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-cover"
            />
          </div>

          {/* Facts. Counted from real data, not typed in. */}
          <div className={`${tile} flex flex-col justify-between`}>
            <div>
              <p className="font-mono text-3xl tabular-nums md:text-4xl">{shipped}</p>
              <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Products shipped
              </p>
            </div>

            {contact?.availability?.status && (
              <p className="mt-5 inline-flex items-center gap-2.5 text-[14px] leading-snug">
                <span className="h-3 w-3 shrink-0 border-2 border-border bg-brand" aria-hidden />
                {contact.availability.status}
              </p>
            )}

            {floatingSkills && floatingSkills.length > 0 && (
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                {floatingSkills.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
