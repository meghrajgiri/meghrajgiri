import Link from "next/link";
import type { SiteConfig } from "@/lib/config";

/**
 * Site footer.
 *
 * Replaces a single centred copyright line, and an unused `Footer.tsx` that was never
 * imported anywhere. Stacked on a phone, three columns from `sm` up — the columns are
 * the enhancement, the stack is the base.
 */
export function SiteFooter({ config }: { config: SiteConfig }) {
  const { personal, contact, navigation, metadata } = config;
  const socials = (contact?.socialLinks ?? []).filter((l) => l.url?.startsWith("http"));

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {personal?.role}
            </p>
            {/* Deliberately not `personal.tagline` — that string is identical to the
                hero headline, so using it here just repeats the top of the page. */}
            <p className="mt-3 max-w-[30ch] font-display text-3xl leading-[1.1] md:text-4xl">
              {personal?.name}
            </p>
            {metadata?.description && (
              <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
                {metadata.description}
              </p>
            )}
            {contact?.availability?.status && (
              <p className="mt-5 inline-flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="h-[7px] w-[7px] rounded-full bg-brand" aria-hidden />
                {contact.availability.status}
              </p>
            )}
          </div>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Navigate
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {(navigation?.items ?? []).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring flex min-h-[40px] items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/projects"
                  className="focus-ring flex min-h-[40px] items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  All projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Elsewhere
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {contact?.contactInfo?.email && (
                <li>
                  <a
                    href={`mailto:${contact.contactInfo.email}`}
                    className="focus-ring flex min-h-[40px] items-center break-all text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {contact.contactInfo.email}
                  </a>
                </li>
              )}
              {socials.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex min-h-[40px] items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            &copy; {new Date().getFullYear()} {metadata?.author ?? personal?.name}
          </p>
          {contact?.contactInfo?.location && (
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {contact.contactInfo.location}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
