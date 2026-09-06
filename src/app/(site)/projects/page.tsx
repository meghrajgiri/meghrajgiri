import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [
  { name: "Home", path: "/" },
  { name: "Case Studies", path: "/projects" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  return {
    title: "Case Studies — Web & Mobile Projects by Meghraj Giri, Nepal",
    description:
      "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more. Built with React, Next.js, TypeScript, and modern technologies.",
    keywords: [
      "Projects",
      "Portfolio",
      "Web Development",
      "React",
      "Next.js",
      "TypeScript",
      "Full Stack",
      "Meghraj Giri",
    ],
    openGraph: {
      title: "Case Studies — Web & Mobile Projects by Meghraj Giri, Nepal",
      description:
        "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more.",
      url: `${config.metadata.url}/projects`,
      siteName: config.metadata.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Case Studies — Meghraj Giri, Developer in Nepal",
      description:
        "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more.",
      creator: config.metadata.twitter,
    },
    alternates: {
      canonical: `${config.metadata.url}/projects`,
    },
  };
}

export default async function ProjectsPage() {
  const config = await getAllConfig();
  const { badge, title, subtitle, callToAction } = config.projects;
  const projects = config.projects.projects.filter(
    (p) => p.published !== false,
  );
  const baseUrl = config.metadata.url;

  const jsonLd = graph([
    // Every other page declares the person these projects belong to; this one did not,
    // leaving the work listed here attached to nobody.
    buildPerson(config),
    buildBreadcrumbs(baseUrl, TRAIL),
    // The list was emitted bare. Wrapping it in a `CollectionPage` says what this URL
    // *is* — a page whose main content is that list — rather than leaving a list
    // floating with no page around it, and gives the items somewhere to belong.
    {
      "@type": "CollectionPage",
      "@id": `${baseUrl}/projects/#collectionpage`,
      url: `${baseUrl}/projects`,
      name: title,
      description: subtitle,
      about: { "@id": personId(baseUrl) },
      mainEntity: { "@id": `${baseUrl}/projects/#itemlist` },
    },
    {
      "@type": "ItemList",
      "@id": `${baseUrl}/projects/#itemlist`,
      name: title,
      description: subtitle,
      numberOfItems: projects.length,
      itemListElement: projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/projects/${project.slug}`,
        name: project.title,
      })),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs trail={TRAIL} />
      <section className="px-6 pb-24 pt-10 md:pt-14">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 md:gap-16">
            {/* Header */}
            <div>
              <p className="label">{badge}</p>
              <h1 className="mt-4 max-w-[20ch] text-[2rem] md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            </div>

            <ProjectsGrid projects={projects} />

            {/* CTA */}
            <div className="grid gap-6 border-t border-border pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-[20ch] text-2xl md:text-3xl">
                  {callToAction.title}
                </h2>
                <p className="mt-3 max-w-[54ch] text-muted-foreground">
                  {callToAction.description}
                </p>
              </div>
              <Link
                href="/#contact"
                className="cta focus-ring inline-flex min-h-[48px] items-center px-8"
              >
                {callToAction.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
