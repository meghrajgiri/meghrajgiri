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
   * Three stat cards. Configured values from the CMS come first; any remaining slots
   * fill from counts derived off the project list, so the row is always three and the
   * derived ones cannot drift out of date the way a typed-in figure does.
   *
   * Both derived stats used to be wrong in a way that cost credibility rather than
   * gaining it. "Industries" counted `category`, and the only categories in the data
   * are App, Web and Open Source — so it advertised "3 industries" for work spanning
   * telehealth, retail, ticketing, recovery and art. "Projects completed" counted
   * `status === "completed"` and therefore excluded everything marked Live, reporting
   * 6 while 14 case studies sat published on the site.
   */
  const live = published.filter(
    (p) => (p.status ?? "").toLowerCase() === "live",
  ).length;

  /**
   * Tenure is derived, never authored.
   *
   * An earlier version kept a hand-typed "5+" in `hero.stats` and hid it when a
   * `careerStart` was set, by testing the stat's label against a regex. That broke
   * the moment someone edited the label in the CMS — trimming "Professional
   * Experience" to "Professional" stopped the match, and the stale card reappeared
   * beside the computed one. Behaviour keyed off hand-typed prose is behaviour that
   * breaks when the prose is edited.
   *
   * So the row is gone from the config instead, and this is the only place tenure
   * comes from. With no `careerStart` the card simply does not render, which is
   * correct: without a start date there is no tenure to state, and a typed figure
   * that silently goes stale is the thing being removed.
   */
  const years = careerStart ? yearsSince(careerStart) : null;

  const stats = [
    // "+" because a whole-year count is a floor: five years and eight months reads as
    // "5+", which is true, where "6" would not be.
    ...(years !== null
      ? [{ value: `${years}+`, label: "Professional experience" }]
      : []),
    ...(hero.stats ?? []).filter((st) => st.value?.trim() && st.label?.trim()),
    { value: String(published.length), label: "Case studies" },
    { value: String(live), label: "Live in production" },
  ].slice(0, 3);

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
