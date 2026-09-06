import Link from "next/link";
import type { SiteConfig } from "@/lib/config";

/**
 * Site footer: identity, every page link, and every way to make contact.
 *
 * The previous version declared three columns and passed four children, so the social
 * links wrapped onto a second grid row under the identity block and left two thirds of
 * that row empty — the hole in the middle of the footer was grid arity, not spacing.
 * Three columns, three children, and the count is now structural rather than a thing
 * to keep in your head.
 *
 * It also ran to roughly 700px, because every link carried `min-h-[40px]` in a
 * vertical list and half the content was already on the page: the display-size name
 * repeated the header logo, the paragraph was `metadata.description` (the meta
 * description already in every page's <head>), and "Available for new projects" was
 * the third copy after the header — where it is pinned on every route — and the
 * closing contact band. Those are gone; the links are all still here.
 */

/** Pages that earn a link but not a slot in the header. */
const SECONDARY = [
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Tech stack" },
  { href: "/hire/react-native-developer-nepal", label: "Hire: React Native" },
  { href: "/hire/nextjs-developer-nepal", label: "Hire: Next.js" },
];

const linkClass =
  "focus-ring inline-flex min-h-[32px] items-center text-[14px] text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter({ config }: { config: SiteConfig }) {
  const { personal, contact, navigation, metadata } = config;

  /**
   * Every stored link, in stored order — including the `mailto:` one.
   *
   * The old filter was `url.startsWith("http")`, which silently dropped the Email
   * entry, so the footer re-added the address from `contactInfo` as a separate item
   * and the two could disagree. Rendering the array whole means this column is pure
   * CMS data: adding Calendly is a new row in Contact → Social Links, not a code
   * change, and it will appear here and nowhere else that has to be kept in sync.
   */
  const links = (contact?.socialLinks ?? []).filter((l) => l.url?.trim());

  return (
    <footer id="site-footer" className="border-t border-border px-6">
      <div className="container mx-auto max-w-6xl py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div>
            <p className="text-[15px] font-semibold text-foreground">
              {personal?.name}
            </p>
            <p className="label mt-2">{personal?.role}</p>
            {contact?.contactInfo?.location && (
              <p className="mt-3 text-[14px] text-muted-foreground">
                {contact.contactInfo.location}
              </p>
            )}
            {contact?.availability?.status && (
              <p className="mt-4 inline-flex items-center gap-2.5 text-[14px] text-muted-foreground">
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full bg-foreground"
                />
                {contact.availability.status}
              </p>
            )}
          </div>

          {/* Navigate.
              
              The header can only carry five items before it stops being scannable, so
              `/experience` and `/skills` are linked from here. Without this they would
              be reachable only from the sitemap and a single link inside the About
              copy, which is thin footing for pages that carry the `worksFor` and
              `alumniOf` evidence. */}
          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="label">
              Navigate
            </h2>
            <ul className="mt-4 flex flex-col">
              {[...(navigation?.items ?? []), ...SECONDARY].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label">Connect</h2>
            <ul className="mt-4 flex flex-col">
              {links.map((link) => {
                // `mailto:` and `tel:` must not get a new tab or a noopener rel —
                // both are meaningless on a handler URL, and `target="_blank"` on a
                // mailto leaves an orphaned blank tab behind in some browsers.
                const external = link.url.startsWith("http");
                return (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={linkClass}
                    >
                      {link.name ?? link.platform}
                      {external && (
                        <span className="sr-only"> (opens in a new tab)</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            &copy; {new Date().getFullYear()}{" "}
            {metadata?.author ?? personal?.name}
          </p>
          {metadata?.url && (
            <p className="label">{metadata.url.replace(/^https?:\/\//, "")}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
