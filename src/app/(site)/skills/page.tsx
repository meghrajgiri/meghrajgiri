import { SkillsSection } from "@/components/sections/SkillsSection";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageCopy, pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";

/** Used only if the CMS `pages.skills` row is missing or blank. */
const FALLBACK = {
  title: "Skills & Tech Stack — Meghraj Giri, Developer in Nepal",
  description:
    "The stack Meghraj Giri builds with: React, Next.js, TypeScript and React Native on the front end; Node.js, PostgreSQL, Supabase and GraphQL behind it. Shipped across e-commerce, telehealth and marketplace products.",
  heading: "What I build with",
  intro:
    "Five years of production work, mostly in the React ecosystem, written from Butwal, Nepal for teams in Nepal, Australia and the United States. Every tool listed here has shipped in something real — below, each one is named with the product it went into.",
};

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [
  { name: "Home", path: "/" },
  { name: "Skills", path: "/skills" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const copy = pageCopy(config, "skills", FALLBACK);
  return pageMetadata(config, {
    path: "/skills",
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
  });
}

export default async function SkillsPage() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const copy = pageCopy(config, "skills", FALLBACK);
  // Both arrays are CMS-owned. The evidence rows are what make this page worth
  // anything — a stack list is a claim, the same list with a shipped product beside
  // each entry is evidence — so an empty array renders no section at all rather than
  // an empty heading.
  const evidence = config.pages?.skills?.evidence ?? [];
  const qa = config.pages?.skills?.qa ?? [];

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, TRAIL),
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/skills/#webpage`,
      url: `${baseUrl}/skills`,
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

      {/* The section below renders as a compact summary band with no heading of its
          own, which is right on the home page and wrong on a page it now owns — so the
          page supplies the h1 and the framing. */}
      <section className="px-6 pb-4 pt-14 md:pt-20">
        <div className="container mx-auto max-w-6xl">
          <p className="label">
            Stack
          </p>
          <h1 className="mt-4 max-w-[20ch] text-[2rem] md:text-5xl">
            {copy.heading}
          </h1>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </div>
      </section>

      <SkillsSection />

      {evidence.length > 0 && (
        <section className="border-t border-border px-6 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
              Where each part of the stack has shipped
            </h2>
            <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
              A stack list on its own is a claim. Here is the product behind
              each one.
            </p>

            <dl className="mt-10 flex flex-col md:mt-14">
              {evidence.map((row) => (
                <div
                  key={row.slug}
                  className="grid gap-2 border-t border-foreground py-5 md:grid-cols-[220px_1fr] md:gap-10"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    {row.tech}
                  </dt>
                  <dd className="text-[17px] leading-[1.75] text-muted-foreground">
                    {row.where}.{" "}
                    <Link
                      href={`/projects/${row.slug}`}
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
      )}

      {qa.length > 0 && (
        <section className="border-t border-border px-6 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
              Common questions
            </h2>
            <div className="mt-10 flex max-w-[68ch] flex-col gap-8 md:mt-14">
              {qa.map((item) => (
                <div key={item.q} className="border-t border-border pt-5">
                  <h3 className="text-xl">{item.q}</h3>
                  <p className="mt-3 text-[17px] leading-[1.75] text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
