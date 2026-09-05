import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageCopy, pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";

/** Used only if the CMS `pages.hire` row is missing or blank. */
const FALLBACK = {
  title: "Hire a Full Stack Developer in Nepal — Meghraj Giri",
  description:
    "Hire Meghraj Giri, a Toptal-verified full stack and frontend developer in Butwal, Nepal. Five years across React, Next.js and React Native, working remotely with clients in Nepal, Australia and the United States.",
  heading: "Hire a full stack developer in Nepal",
  intro:
    "Meghraj Giri is a full stack and frontend developer based in Butwal, Nepal, with five years of production experience and Toptal Verified Expert status in engineering.",
};

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [
  { name: "Home", path: "/" },
  { name: "Hire", path: "/hire" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const copy = pageCopy(config, "hire", FALLBACK);
  return pageMetadata(config, {
    path: "/hire",
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
  });
}

/**
 * The hub for hire-intent queries.
 *
 * Deliberately not a second contact page: `/contact` handles reaching him and what to
 * put in the message. This page answers the questions someone asks *before* they
 * decide to write — cost, verification, timezone, agency versus individual — and hands
 * off to the stack-specific pages for anyone who already knows what they need built.
 */
export default async function HirePage() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const copy = pageCopy(config, "hire", FALLBACK);
  const stacks = config.hire?.pages ?? [];
  const qa = config.hire?.qa ?? [];

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, TRAIL),
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/hire/#webpage`,
      url: `${baseUrl}/hire`,
      name: copy.title,
      description: copy.description,
      about: { "@id": personId(baseUrl) },
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs trail={TRAIL} />

      <section className="px-6 pb-4 pt-10 md:pt-14">
        <div className="container mx-auto max-w-6xl">
          <p className="inline-block border-2 border-border bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink)]">
            Hire
          </p>
          <h1 className="mt-4 max-w-[22ch] text-[2rem] md:text-5xl">
            {copy.heading}
          </h1>
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
            Hire by what you need built
          </h2>
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2">
            {stacks.map((page) => (
              <article key={page.slug} className="nb bg-card p-6 md:p-8">
                <h3 className="text-xl md:text-2xl">
                  <Link
                    href={`/hire/${page.slug}`}
                    className="focus-ring underline underline-offset-4"
                  >
                    {page.h1}
                  </Link>
                </h3>
                <p className="mt-3 text-[17px] leading-[1.75] text-muted-foreground">
                  {page.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
            What people ask before hiring
          </h2>
          <div className="mt-10 flex max-w-[68ch] flex-col gap-8 md:mt-14">
            {qa.map((item) => (
              <div key={item.q} className="border-t-2 border-border pt-5">
                <h3 className="text-xl">{item.q}</h3>
                <p className="mt-3 text-[17px] leading-[1.75] text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t-2 border-border pt-10">
            <p className="max-w-[54ch] text-lg text-muted-foreground">
              The fastest way to find out whether this is a fit is to describe what you
              are building.
            </p>
            <Link
              href="/contact"
              className="nb nb-press focus-ring mt-6 inline-flex min-h-[48px] items-center bg-brand px-7 font-bold text-[var(--brand-ink)]"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
