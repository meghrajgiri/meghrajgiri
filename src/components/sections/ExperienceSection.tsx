"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

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
export function ExperienceSection({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const { experience } = useSiteConfig();
  const roles = experience?.experiences ?? [];
  if (roles.length === 0) return null;

  const Heading = heading;

  return (
    <section id="journey" className="border-t border-border px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <p className="inline-block border-2 border-border bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink)]">
          Experience
        </p>
        <Heading className="mt-4 max-w-[20ch] text-[2rem] md:text-5xl">
          Five roles, five years, one thread
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
              className="grid gap-2 border-t-2 border-foreground py-6 md:grid-cols-[160px_1fr] md:gap-10 md:py-8"
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
