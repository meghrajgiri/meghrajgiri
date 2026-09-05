import { ContactSection } from "@/components/sections/ContactSection";
import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageCopy, pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";

/** Used only if the CMS `pages.contact` row is missing or blank. */
const FALLBACK = {
  title: "Contact Meghraj Giri — Full Stack Developer in Butwal, Nepal",
  description:
    "Get in touch with Meghraj Giri, a full stack and frontend developer based in Butwal, Nepal. Available for new web and mobile projects, remote, working 9 AM – 6 PM Nepal time (UTC+5:45).",
};

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const copy = pageCopy(config, "contact", FALLBACK);
  return pageMetadata(config, {
    path: "/contact",
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
  });
}

export default async function ContactPage() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const availability = config.contact?.availability;
  const copy = pageCopy(config, "contact", FALLBACK);
  const cards = config.pages?.contact?.cards ?? [];
  const qa = config.pages?.contact?.qa ?? [];

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, TRAIL),
    {
      "@type": "ContactPage",
      "@id": `${baseUrl}/contact/#contactpage`,
      url: `${baseUrl}/contact`,
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

      <ContactSection heading="h1" />

      <section className="border-t border-border px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
            What I take on
          </h2>
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
            {cards.map((item) => (
              <article key={item.title} className="nb bg-card p-6 md:p-8">
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.75] text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          {availability && (
            <p className="mt-10 max-w-[62ch] text-[17px] leading-[1.75] text-muted-foreground">
              {availability.status}. {availability.responseTime}. Working hours
              are {availability.workingHours}. If it is a fit, the next step is
              usually a short call and a written scope before anything is
              committed — you can see the kind of work that comes out of it in
              the{" "}
              <Link
                href="/projects"
                className="focus-ring underline underline-offset-4 hover:text-foreground"
              >
                case studies
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <h2 className="max-w-[24ch] text-[2rem] md:text-4xl">
            Before you write
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
        </div>
      </section>
    </>
  );
}
