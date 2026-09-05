import Link from "next/link";

/**
 * Visible breadcrumb trail.
 *
 * The site has emitted `BreadcrumbList` structured data on inner pages for a while
 * with no corresponding trail on the page. That is markup describing navigation the
 * visitor cannot see — and the schema is only meant to reflect a real path, not stand
 * in for one. It also matters for people: with the section anchors replaced by real
 * URLs, `/projects/khatapata` is now three levels deep and the only way back up was
 * the header.
 *
 * The last crumb is the current page, so it is rendered as plain text rather than a
 * link to itself and carries `aria-current`.
 */
export function Breadcrumbs({
  trail,
}: {
  trail: Array<{ name: string; path: string }>;
}) {
  if (trail.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="px-6 pt-8 md:pt-10">
      <ol className="container mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {trail.map((crumb, i) => {
          const isCurrent = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="focus-ring underline underline-offset-4 hover:text-foreground"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
