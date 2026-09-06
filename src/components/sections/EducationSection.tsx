"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * Academic history.
 *
 * Like `ExperienceSection`, this renders config that has always existed and has never
 * been shown. It earns its place for one narrow reason: a named, verifiable
 * institution is the strongest disambiguating fact a person page can carry. "A
 * developer named Meghraj" is ambiguous; "a developer who took a BSc CSIT at Tribhuvan
 * University" resolves to one person, and is the visible content that `Person.alumniOf`
 * has to be backed by.
 */
export function EducationSection({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const { education } = useSiteConfig();
  const entries = education?.education ?? [];
  if (entries.length === 0) return null;

  const Heading = heading;

  return (
    <section id="education" className="border-t border-border px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <p className="label">
          Education
        </p>
        <Heading className="mt-4 max-w-[20ch] text-[2rem] md:text-5xl">
          {education?.title ?? "Academic Journey"}
        </Heading>
        {education?.subtitle && (
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
            {education.subtitle}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.id} className="panel bg-card p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {entry.period} · {entry.type}
              </p>
              <h3 className="mt-3 text-xl md:text-2xl">
                {entry.degree}
                {entry.field && (
                  <span className="text-muted-foreground"> in {entry.field}</span>
                )}
              </h3>
              {/* The institution is the citable fact, so it is set as its own line
                  rather than folded into the description. */}
              <p className="mt-1.5 text-[15px] font-semibold">{entry.institution}</p>
              <p className="mt-3 text-[17px] leading-[1.75] text-muted-foreground">
                {entry.description}
              </p>
              {entry.skills?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                  {entry.skills.map((skill) => (
                    <li
                      key={skill}
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
