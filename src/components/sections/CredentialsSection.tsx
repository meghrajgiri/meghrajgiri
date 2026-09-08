"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * Third-party credentials, shown.
 *
 * These already existed in `personal.credentials` and were emitted as
 * `Person.hasCredential` in the JSON-LD of all 28 pages — but rendered nowhere. Google's
 * structured-data policy is that markup should reflect the content of the page, and an
 * audit caught the freeCodeCamp certificate asserted in schema while appearing in no
 * visible copy anywhere on the site.
 *
 * The fix is to show them rather than to drop them from the graph. Both are real and
 * carry a verification URL, and a credential someone else issued and a stranger can
 * check is worth more on this page than any sentence written about oneself.
 */
export function CredentialsSection() {
  const { personal } = useSiteConfig();
  const credentials = personal?.credentials ?? [];

  if (credentials.length === 0) return null;

  return (
    <section className="px-6 py-14 md:py-20">
      <div className="container mx-auto max-w-6xl">
        <p className="label">Credentials</p>
        <h2 className="mt-4 max-w-[22ch] text-[2rem] md:text-4xl">
          Verified by someone else
        </h2>
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
          Each of these was issued by a third party and can be checked without taking
          anything here on trust.
        </p>

        <ul className="mt-8 divide-y divide-border border-t border-border">
          {credentials.map((credential) => (
            <li
              key={credential.name}
              className="grid gap-1 py-5 md:grid-cols-[200px_1fr] md:gap-10"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {credential.issuer}
              </span>
              <span className="text-[16px] md:text-[17px]">
                {credential.url ? (
                  <a
                    href={credential.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {credential.name}
                  </a>
                ) : (
                  credential.name
                )}
                {credential.category && (
                  <span className="ml-2 text-muted-foreground">
                    · {credential.category}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
