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
  const { summary, metrics, sections } = caseStudy;
  if (!summary && !metrics?.length && !sections?.length) return null;

  return (
    <div className="mt-16 border-t border-border/50 pt-12">
      {summary && (
        <p className="text-xl leading-relaxed md:text-2xl">{summary}</p>
      )}

      {metrics && metrics.length > 0 && (
        <div className="mt-10 grid gap-6 border-y border-border/50 py-8 sm:grid-cols-3">
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
