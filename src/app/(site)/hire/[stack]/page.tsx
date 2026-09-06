import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const config = await getAllConfig();
  return (config.hire?.pages ?? []).map((page) => ({ stack: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stack: string }>;
}): Promise<Metadata> {
  const { stack } = await params;
  const config = await getAllConfig();
  const page = config.hire?.pages?.find((p) => p.slug === stack);
  if (!page) return {};

  return pageMetadata(config, {
    path: `/hire/${page.slug}`,
    title: page.title,
    description: page.description,
    keywords: page.keywords,
  });
}

/**
 * A spoke page per stack.
 *
 * The evidence list is the point. Anyone can write "React Native developer"; naming
 * the three shipped apps and linking to their case studies is the part a reader — or a
 * model deciding whether to cite this page — can actually check.
 */
export default async function HireStackPage({
  params,
}: {
  params: Promise<{ stack: string }>;
}) {
  const { stack } = await params;
  const config = await getAllConfig();
  const page = config.hire?.pages?.find((p) => p.slug === stack);
  if (!page) notFound();

  const baseUrl = config.metadata.url;

  const trail = [
    { name: "Home", path: "/" },
    { name: "Hire", path: "/hire" },
    { name: page.stack, path: `/hire/${page.slug}` },
  ];

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, trail),
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/hire/${page.slug}/#webpage`,
      url: `${baseUrl}/hire/${page.slug}`,
      name: page.title,
      description: page.description,
      about: { "@id": personId(baseUrl) },
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs trail={trail} />

      <section className="px-6 pb-4 pt-10 md:pt-14">
        <div className="container mx-auto max-w-6xl">
          <p className="label">
            {page.stack}
          </p>
          <h1 className="mt-4 max-w-[22ch] text-[2rem] md:text-5xl">{page.h1}</h1>
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-muted-foreground">
            {page.intro}
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
            Shipped with {page.stack}
          </h2>
          <dl className="mt-8 flex flex-col md:mt-10">
            {page.evidence.map((item) => (
              <div
                key={item.slug}
                className="grid gap-2 border-t border-foreground py-5 md:grid-cols-[200px_1fr] md:gap-10"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                  {item.name}
                </dt>
                <dd className="text-[17px] leading-[1.75] text-muted-foreground">
                  {item.note}{" "}
                  <Link
                    href={`/projects/${item.slug}`}
                    className="focus-ring underline underline-offset-4 hover:text-foreground"
                  >
                    Read the case study
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">Questions</h2>
          <div className="mt-10 flex max-w-[68ch] flex-col gap-8 md:mt-14">
            {page.qa.map((item) => (
              <div key={item.q} className="border-t border-border pt-5">
                <h3 className="text-xl">{item.q}</h3>
                <p className="mt-3 text-[17px] leading-[1.75] text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4 border-t border-border pt-10">
            <Link
              href="/contact"
              className="cta focus-ring inline-flex min-h-[48px] items-center px-7"
            >
              Start a conversation
            </Link>
            <Link
              href="/hire"
              className="cta-ghost focus-ring inline-flex min-h-[48px] items-center px-6"
            >
              All hire options
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
