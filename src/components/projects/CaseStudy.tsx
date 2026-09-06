import { Markdown } from "@/lib/markdown";
import type { SiteConfig } from "@/lib/config";

type Project = SiteConfig["projects"]["projects"][number];

/**
 * The long-form case study body.
 *
 * A server component on purpose: this is the bulk of the page's text, and rendering it
 * server-side means the Markdown never reaches the browser as a parser. `ProjectDetail`
 * stays a client component only because of the lightbox.
 */
export function CaseStudy({ caseStudy }: { caseStudy: NonNullable<Project["caseStudy"]> }) {
  const { summary, facts, metrics, sections } = caseStudy;

  // Only the facts that were actually filled in. A strip reading "Role: —" is worse
  // than no strip.
  const factRows: Array<[string, string]> = (
    [
      ["Role", facts?.role],
      ["Timeline", facts?.timeline],
      ["Team", facts?.team],
      ["Status", facts?.status],
    ] as Array<[string, string | undefined]>
  )
    .filter(([, value]) => !!value?.trim())
    .map(([label, value]) => [label, value as string]);

  if (!summary && !factRows.length && !metrics?.length && !sections?.length) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-border pt-12">
      {summary && (
        <p className="text-xl leading-relaxed md:text-2xl">{summary}</p>
      )}

      {factRows.length > 0 && (
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {factRows.map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-[15px] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {metrics && metrics.length > 0 && (
        <div className="mt-10 grid gap-6 border-y border-border py-8 sm:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="text-3xl font-bold tabular-nums md:text-4xl">{m.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {sections?.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="text-2xl font-bold md:text-3xl">{section.heading}</h2>
          <Markdown source={section.body} />
        </section>
      ))}
    </div>
  );
}
