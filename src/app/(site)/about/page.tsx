import { AboutSection } from "@/components/sections/AboutSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageCopy, pageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbs,
  buildPerson,
  buildProfilePage,
  graph,
  personId,
} from "@/lib/schema";
import type { Metadata } from "next";

/** Used only if the CMS `pages.about` row is missing or blank. */
const FALLBACK = {
  title: "About Meghraj Giri — Full Stack Developer in Butwal, Nepal",
  description:
    "Meghraj Giri is a full stack developer based in Butwal, Nepal, with five years building web and mobile products for teams in Nepal, Australia and the United States. BSc CSIT, Tribhuvan University. Toptal-verified engineer.",
  heading: "Meghraj Giri — full stack developer in Butwal, Nepal",
};

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [{"name": "Home", "path": "/"}, {"name": "About", "path": "/about"}];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const copy = pageCopy(config, "about", FALLBACK);
  return pageMetadata(config, {
    path: "/about",
    title: copy.title,
    description: copy.description,
    type: "profile",
    keywords: copy.keywords,
  });
}

/**
 * The entity anchor.
 *
 * Of every URL on this site, this is the one whose job is to answer "which Meghraj?".
 * The brand SERP is currently shared with a Gujarati town, an investment group founded
 * in 1922, an Indian government cloud programme and several unrelated politicians, and
 * no amount of keyword work fixes that — only a page that states, in plain prose a
 * machine can lift, that this particular person is a developer in Butwal who studied
 * at Tribhuvan University and works for named companies.
 *
 * That is also why the experience and education sections live here rather than only on
 * the home page: `Person.alumniOf` and `Person.worksFor` need visible copy standing
 * behind them.
 */
export default async function AboutPage() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const copy = pageCopy(config, "about", FALLBACK);

  // The Person node is emitted here, not merely referenced. A page that points at
  // `#person` without defining it anywhere leaves a consumer that never fetched the
  // home page holding a dangling id — and this is the page most likely to be read on
  // its own.
  const jsonLd = graph([
    buildPerson(config),
    buildProfilePage(config, "/about", copy.title),
    buildBreadcrumbs(baseUrl, TRAIL),
    {
      "@type": "AboutPage",
      "@id": `${baseUrl}/about/#aboutpage`,
      url: `${baseUrl}/about`,
      name: copy.title,
      description: copy.description,
      mainEntity: { "@id": personId(baseUrl) },
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs trail={TRAIL} />
      <AboutSection
        heading="h1"
        title={copy.heading}
      />
      <ExperienceSection />
      <EducationSection />
    </>
  );
}
