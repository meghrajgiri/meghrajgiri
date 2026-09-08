"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { yearsSince } from "@/lib/duration";

/**
 * Employment history, as a dated timeline.
 *
 * This data has been sitting in `site_config.experience` — five roles with companies,
 * dates and stacks — since the CMS editor for it was built, and nothing has ever
 * rendered it. The only consumer was `AboutSection`, which read `experiences.length`
 * to print the number "5" while the roles themselves stayed invisible to readers and
 * crawlers alike.
 *
 * That absence is the reason the site cannot establish who this person is. Named
 * employers with dates are the primary evidence behind `Person.worksFor`, and they are
 * what lets a search engine — or an AI answer — attribute work to a specific developer
 * rather than to one of the several unrelated people sharing the name.
 */
/**
 * Small counts read better as words in a heading, and this one is prose rather than
 * data. Falls back to the digits past twelve, where words start to read worse than
 * numerals.
 */
const WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];
function spell(n: number) {
  return (WORDS[n] ?? String(n)).toLowerCase();
}

export function ExperienceSection({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const { experience, personal } = useSiteConfig();

  /**
   * Both numbers in the heading, derived.
   *
   * It read "Five roles, five years" as literal text while the data said five roles and
   * six years, and while the hero — which already derives its count from
   * `personal.careerStart` — said six. A number typed into a heading is a number that
   * goes stale on the next birthday or the next job, silently, on the page whose whole
   * job is to be the record of both.
   */
  const roleCount = experience?.experiences?.length ?? 0;
  const years = personal?.careerStart ? yearsSince(personal.careerStart) : null;
  const title =
    roleCount && years
      ? `${WORDS[roleCount] ?? roleCount} roles, ${spell(years)} years, one thread`
      : "One thread";
  const roles = experience?.experiences ?? [];
  if (roles.length === 0) return null;

  const Heading = heading;

  return (
    <section id="journey" className="border-t border-border px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <p className="label">
          Experience
        </p>
        <Heading className="mt-4 max-w-[20ch] text-[2rem] md:text-5xl">
          {title}
        </Heading>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
          Every position below is a product team shipping to real users — mobile
          marketplaces, clinic software, reservation systems — built from Butwal, Nepal
          for clients in Nepal, Australia and the United States.
        </p>

        <ol className="mt-10 flex flex-col md:mt-14">
          {roles.map((role) => (
            <li
              key={`${role.company}-${role.year}`}
              className="grid gap-2 border-t border-foreground py-6 md:grid-cols-[160px_1fr] md:gap-10 md:py-8"
            >
              {/* The dates lead on desktop and sit above the role on a phone. A
                  timeline whose dates are buried inside the body copy stops being a
                  timeline. */}
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <span className="block text-foreground">
                  {role.year} — {role.period}
                </span>
                <span className="mt-1 block">{role.type}</span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl">
                  {role.title}
                  <span className="text-muted-foreground"> · {role.company}</span>
                </h3>
                <p className="mt-2 max-w-[62ch] text-[17px] leading-[1.75] text-muted-foreground">
                  {role.description}
                </p>
                {role.technologies?.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                    {role.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
