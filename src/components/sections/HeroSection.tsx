"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { yearsSince } from "@/lib/duration";

/**
 * Hero: identity on the left, three verifiable numbers down the right.
 *
 * The portrait that used to occupy the right column is gone. Rather than let the
 * identity panel run the full width — which would have stretched a 46ch measure
 * across 1152px and left a large dead margin — the stat cards moved up into the
 * column it vacated. The composition keeps its 2:1 split and its bento feel, and
 * nothing had to be invented to fill the gap.
 */
export function HeroSection() {
  const { hero, personal, projects } = useSiteConfig();

  const careerStart = personal?.careerStart;

  if (!hero) return null;

  const { mainTitle, description, highlightedTerms, buttons } = hero;
  const published = (projects?.projects ?? []).filter(
    (p) => p.published !== false,
  );

  /**
   * Three stat cards: two derived, one authored.
   *
   * The row is composed explicitly rather than assembled from a longer list and
   * truncated. The previous version concatenated every configured stat ahead of the
   * derived counts and then took the first three, so adding a second stat in the CMS
   * would silently push the case-study count out of the row — a figure that is always
   * true and always current, displaced by one that someone typed.
   *
   * Slot 1 and slot 3 are computed and cannot go stale. Slot 2 is the one editable
   * card; `.slice(0, 1)` enforces that rather than trusting the config's length, so a
   * second row added to `hero.stats` is ignored instead of costing the case-study
   * count its place.
   *
   * An earlier pass also derived "Live in production" as a fourth candidate. With
   * tenure and one authored stat present it was never reachable, so it is gone rather
   * than sitting in the array looking like it does something.
   */
  const years = careerStart ? yearsSince(careerStart) : null;
  const authored = (hero.stats ?? [])
    .filter((st) => st.value?.trim() && st.label?.trim())
    .slice(0, 1);

  const stats = [
    // "+" because a whole-year count is a floor: five years and eight months reads as
    // "5+", which is true, where "6" would not be.
    ...(years !== null
      ? [{ value: `${years}+`, label: "Professional experience" }]
      : []),
    ...authored,
    { value: String(published.length), label: "Case studies" },
  ];

  const secondary = hero.buttons?.secondary;

  const lede = () => {
    const terms = [highlightedTerms?.term1, highlightedTerms?.term2].filter(
      Boolean,
    ) as string[];
    if (!terms.length) return description;
    const pattern = new RegExp(
      `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "g",
    );
    return description.split(pattern).map((part, i) =>
      terms.includes(part) ? (
        // Monochrome leaves no accent to mark a term with, so emphasis is carried by
        // weight and a rule under the word instead of by hue.
        <span
          key={i}
          className="font-medium text-foreground underline decoration-border-strong decoration-1 underline-offset-[5px]"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <section className="px-6 pb-10 pt-10 md:pb-14 md:pt-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {/* Identity */}
          <div className="panel flex flex-col bg-card p-6 md:col-span-2 md:p-10">
            <div>
              <p className="label">
                {personal?.role ?? "Full stack developer"} &middot;{" "}
                {personal?.location ?? "Remote"}
              </p>
              <h1 className="mt-5 text-[2.4rem] leading-[1.03] sm:text-5xl lg:text-[3.4rem]">
                {mainTitle?.line1}
                <span className="block text-muted-foreground">
                  {mainTitle?.line2}
                </span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {lede()}
              </p>
            </div>

            {/* Primary and secondary both come from `hero.buttons`.
                
                The second slot used to be a hardcoded GitHub link pulled out of
                `contact.socialLinks`, which meant the CMS's "Secondary Button" fields
                were editable and rendered nowhere — and the hero's only other action
                could not be changed without a deploy. GitHub is still one click away
                in the header and again in the footer's Connect column. */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {buttons?.primary && (
                <Link
                  href={buttons.primary.href}
                  className="cta focus-ring inline-flex min-h-[48px] items-center px-6"
                >
                  {buttons.primary.text}
                </Link>
              )}
              {secondary?.text && secondary?.href && (
                <Link
                  href={secondary.href}
                  className="cta-ghost focus-ring inline-flex min-h-[48px] items-center px-6 text-[15px]"
                >
                  {secondary.text}
                </Link>
              )}
            </div>
          </div>

          {/* Stats, stacked into the column the portrait used to hold. `flex-1` on
              each card splits that height evenly, so the three of them square off
              against the identity panel instead of leaving a gap under the last. */}
          <div className="flex flex-col gap-4 md:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="panel flex flex-1 flex-col justify-center bg-card px-6 py-5"
              >
                <p className="font-mono text-3xl tabular-nums leading-none text-foreground">
                  {stat.value}
                </p>
                <p className="label mt-2.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
