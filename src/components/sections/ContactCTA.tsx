"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * A closing band, not a second contact form.
 *
 * The home page embedded the whole `ContactSection` — four fields, submit handling
 * and status messaging — while `/contact` rendered exactly the same component. Two
 * live forms posting to one endpoint is a maintenance trap and gave `/contact`
 * nothing of its own to do.
 *
 * The pitch keeps the left column and the primary action sits directly under the
 * copy it belongs to, rather than floating at the bottom-right of an otherwise empty
 * half. The right column carries the facts a visitor actually wants before writing —
 * where to send it, how long a reply takes, which timezone they are writing into —
 * as the same bordered rail `/contact` uses, so the two pages read as one system.
 */
export function ContactCTA() {
  const { contact, about } = useSiteConfig();

  const info = contact?.contactInfo;
  const availability = contact?.availability;
  const cta = about?.callToAction;

  const rows = [
    info?.email && {
      term: "Email",
      node: (
        <a
          href={`mailto:${info.email}`}
          className="focus-ring break-all font-mono text-[14px] text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground"
        >
          {info.email}
        </a>
      ),
    },
    availability?.responseTime && {
      term: "Response",
      node: (
        <span className="text-[15px] text-muted-foreground">
          {availability.responseTime}
        </span>
      ),
    },
    availability?.workingHours && {
      term: "Hours",
      node: (
        <span className="text-[15px] text-muted-foreground">
          {availability.workingHours}
        </span>
      ),
    },
    info?.location && {
      term: "Based",
      node: (
        <span className="text-[15px] text-muted-foreground">
          {info.location}
        </span>
      ),
    },
  ].filter(Boolean) as Array<{ term: string; node: React.ReactNode }>;

  return (
    <section id="contact" className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:gap-16">
          <div>
            {availability?.status && (
              <p className="flex items-center gap-2.5">
                {/* Availability is a status, and with no accent hue to carry it the
                    dot is filled in the foreground colour. Colour was never doing
                    the work alone — the label states it in words. */}
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full bg-foreground"
                />
                <span className="label">{availability.status}</span>
              </p>
            )}

            <h2 className="mt-5 max-w-[18ch] text-[2rem] md:text-[2.75rem]">
              {cta?.title ?? "Let's build something meaningful"}
            </h2>

            <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-muted-foreground">
              {cta?.description ??
                "Whether you're validating an MVP or scaling a product, I'd love to hear about it."}
            </p>

            <Link
              href="/contact"
              className="cta focus-ring mt-8 inline-flex min-h-[48px] items-center px-7"
            >
              {cta?.buttonText ?? "Start a conversation"}
            </Link>
          </div>

          {rows.length > 0 && (
            <dl className="flex flex-col md:pt-1">
              {rows.map((row) => (
                <div
                  key={row.term}
                  className="border-t border-border py-4 last:border-b"
                >
                  <dt className="label">{row.term}</dt>
                  <dd className="mt-1.5">{row.node}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
