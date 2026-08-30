"use client";

import Image from "next/image";
import Link from "next/link";
import { WindowBar } from "@/components/projects/WindowFrame";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

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

  const { mainTitle, description, highlightedTerms, buttons } = hero;
  const published = (projects?.projects ?? []).filter((p) => p.published !== false);
  const completed = published.filter((p) => (p.status ?? "").toLowerCase() === "completed").length;
  const industries = new Set(published.map((p) => p.category).filter(Boolean)).size;

  /**
   * Three stat cards. Configured values from the CMS come first; any remaining slots
   * fill from counts derived off the project list, so the row is always three and the
   * derived ones cannot drift out of date the way a typed-in figure does.
   */
  const stats = [
    ...(hero.stats ?? []).filter((st) => st.value?.trim() && st.label?.trim()),
    { value: String(completed), label: "Projects completed" },
    { value: String(industries), label: "Industries" },
    { value: String(published.length), label: "Products shipped" },
  ].slice(0, 3);
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
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {/* Identity */}
          <div className={`${tile} flex flex-col md:col-span-2`}>
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
                  className="text-base underline decoration-border underline-offset-4"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right column: portrait, with the count sitting under it. */}
          <div className="flex flex-col gap-4 md:gap-5">
            <div className="nb flex flex-1 flex-col overflow-hidden bg-brand">
              <WindowBar path="~/meghraj.jpg" />
              <div className="relative min-h-[260px] flex-1">
                <Image
                  src="/Meghraj.jpg"
                  alt={personal?.name ? `${personal.name}, ${personal.role}` : "Portrait"}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>

          {/* Stat cards */}
          {stats.map((stat) => (
            <div key={stat.label} className="nb bg-card px-5 py-4">
              <p className="font-mono text-3xl leading-none tabular-nums">{stat.value}</p>
              <p className="mt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
