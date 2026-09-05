import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageCopy, pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";

/** Used only if the CMS `pages.experience` row is missing or blank. */
const FALLBACK = {
  title: "Experience — Meghraj Giri, Full Stack Developer in Nepal",
  description:
    "Five years and five roles: full stack development at SCSS Consulting, React Native at Inseed, software engineering at Gurzu, and React at Prabidhi Labs and Lightweb Group — built from Butwal, Nepal.",
};

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [{"name": "Home", "path": "/"}, {"name": "Experience", "path": "/experience"}];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const copy = pageCopy(config, "experience", FALLBACK);
  return pageMetadata(config, {
    path: "/experience",
    title: copy.title,
    description: copy.description,
    type: "profile",
    keywords: copy.keywords,
  });
}

/**
 * Employment history as its own URL.
 *
 * The nav has linked to `#journey` since it was written, and no such section existed
 * anywhere in the DOM — the link went nowhere on every page of the site. The content
 * it promised was written and stored all along; this is where it now lives.
 */
export default async function ExperiencePage() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const roles = config.experience?.experiences ?? [];
  const copy = pageCopy(config, "experience", FALLBACK);

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, TRAIL),
    {
      "@type": "ItemList",
      name: "Professional experience",
      numberOfItems: roles.length,
      itemListElement: roles.map((role, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "OrganizationRole",
          roleName: role.title,
          startDate: role.year,
          ...(role.status !== "current" && { endDate: role.period }),
          memberOf: { "@type": "Organization", name: role.company },
        },
      })),
    },
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/experience/#webpage`,
      url: `${baseUrl}/experience`,
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
      <ExperienceSection heading="h1" />
    </>
  );
}
