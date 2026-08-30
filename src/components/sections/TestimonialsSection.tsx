"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * Client testimonials.
 *
 * Gated deliberately. The stored testimonials are placeholders — "Founder,
 * Early-Stage Startup" at "Tech Startup" — with no real name or company, and their
 * portrait paths point at a directory that does not exist. Unattributed praise on a
 * portfolio is fabricated credibility: it is the first thing to collapse when a
 * prospect asks who said it.
 *
 * So an entry renders only when it carries a real person's name AND a company. Until
 * then the section returns null and the page simply does not have it, which is the
 * honest state.
 */

/** A name that is a role description rather than a person. */
const PLACEHOLDER = /(founder|engineering lead|product manager|ceo|cto|vp)\s*,|^(early-stage|enterprise|saas|tech)\b/i;

function isReal(t: { author?: string; company?: string }) {
  const author = (t.author ?? "").trim();
  const company = (t.company ?? "").trim();
  if (!author || !company) return false;
  if (PLACEHOLDER.test(author)) return false;
  // A real attribution is a person's name: at least two words, no comma-role syntax.
  return author.split(/\s+/).length >= 2 && !author.includes(",");
}

export function TestimonialsSection() {
  const { testimonials } = useSiteConfig();
  const real = (testimonials?.testimonials ?? []).filter(isReal);
  if (real.length === 0) return null;

  return (
    <section id="testimonials" className="border-t border-border px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
          {testimonials?.badge ?? "Testimonials"}
        </p>
        <h2 className="mt-3 max-w-[20ch] text-[2rem] md:text-5xl">{testimonials?.title}</h2>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {real.map((t) => (
            <figure key={t.id} className="border-t-2 border-foreground pt-5">
              <blockquote className="text-[17px] leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5">
                <span className="block text-[15px] font-semibold">{t.author}</span>
                <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {[t.title, t.company].filter(Boolean).join(" · ")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
