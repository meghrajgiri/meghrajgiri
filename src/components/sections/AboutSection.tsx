"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { yearsSince } from "@/lib/duration";

/**
 * About as a two-column editorial spread: a narrow metadata rail against a measured
 * prose column.
 *
 * Long-form copy set full-width is the fastest way to make a bio go unread. Holding it
 * to a ~60-character measure and putting the numbers in a rail beside it lets someone
 * skim the facts or read the paragraphs, without forcing either.
 */
/**
 * @param title Overrides the CMS heading. The home page wants the short editorial line
 *   ("I build products, not just code"); `/about` is the page that has to answer "which
 *   Meghraj?", so it states the name, the role and the city instead.
 */
export function AboutSection({
  heading = "h2",
  title,
}: {
  heading?: "h1" | "h2";
  title?: string;
}) {
  const { about, experience, education, personal } = useSiteConfig();
  const Heading = heading;
  if (!about) return null;

  const paragraphs = Array.isArray(about.description) ? about.description : [];

  /**
   * The rail's tenure figure is derived from the same `personal.careerStart` the hero
   * uses, and is prepended rather than substituted over an authored row. Matching the
   * authored row by its label was brittle — editing the label in the CMS silently
   * brought the stale value back — so the authored row is gone from the config and
   * this is the only source.
   */
  const tenureYears = personal?.careerStart
    ? yearsSince(personal.careerStart)
    : null;
  const stats = [
    ...(tenureYears !== null
      ? [{ value: `${tenureYears}+`, label: "Years in tech" }]
      : []),
    ...(about.stats ?? []).filter((s) => s.value?.trim() && s.label?.trim()),
  ];

  const years = experience?.experiences?.length ?? 0;
  const schools = education?.education?.length ?? 0;

  return (
    <section id="about" className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <p className="label">{about.badge}</p>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_minmax(0,300px)] lg:gap-20">
          <div>
            <Heading className="max-w-[18ch] text-[2rem] md:text-5xl">
              {title ?? about.title}
            </Heading>
            {about.subtitle && (
              <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted-foreground md:mt-6 md:text-xl">
                {about.subtitle}
              </p>
            )}

            <div className="mt-8 flex max-w-[62ch] flex-col gap-5">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-[17px] leading-[1.75] text-muted-foreground"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          <aside className="lg:pt-3">
            {stats.length > 0 && (
              <dl className="flex flex-col">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-t border-border py-4 last:border-b"
                  >
                    <dd className="font-mono text-2xl tabular-nums">
                      {stat.value}
                    </dd>
                    <dt className="mt-0.5 text-sm text-muted-foreground">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            {/* This line used to be a dead claim: it counted five roles and two
                qualifications that appeared nowhere on the site, which made the
                numbers beside it look equally unsupported. Now it links to the pages
                that show the evidence. */}
            {(years > 0 || schools > 0) && (
              <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
                {years > 0 && (
                  <Link
                    href="/experience"
                    className="focus-ring underline underline-offset-4 hover:text-foreground"
                  >
                    {years} roles
                  </Link>
                )}
                {years > 0 && schools > 0 && " · "}
                {schools > 0 && (
                  <Link
                    href="/about#education"
                    className="focus-ring underline underline-offset-4 hover:text-foreground"
                  >
                    {schools} qualifications
                  </Link>
                )}
              </p>
            )}
          </aside>
        </div>

        {about.callToAction && (
          <div className="mt-20 border-t border-border pt-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h3 className="max-w-[22ch] text-[1.75rem] md:text-4xl">
                  {about.callToAction.title}
                </h3>
                <p className="mt-4 max-w-[54ch] text-lg text-muted-foreground">
                  {about.callToAction.description}
                </p>
              </div>
              <Link
                href="/contact"
                className="cta focus-ring inline-flex min-h-[48px] items-center self-start px-7 lg:self-auto"
              >
                {about.callToAction.buttonText}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
