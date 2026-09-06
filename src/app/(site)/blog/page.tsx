import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { pageCopy, pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";

/** Used only if the CMS `pages.blog` row is missing or blank. */
const FALLBACK = {
  title: "Articles — Hiring and Building Software in Nepal",
  description:
    "Practical writing on hiring developers in Nepal, what software actually costs here, and building for international clients from Butwal — by Meghraj Giri.",
  heading: "Hiring and building software in Nepal",
  intro:
    "Written from Butwal, for people deciding whether to hire here and for developers working the same way.",
};

/** One source of truth for the visible trail and the BreadcrumbList schema. */
const TRAIL = [
  { name: "Home", path: "/" },
  { name: "Articles", path: "/blog" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const copy = pageCopy(config, "blog", FALLBACK);
  return pageMetadata(config, {
    path: "/blog",
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
  });
}

const byNewest = (a: { published: string }, b: { published: string }) =>
  b.published.localeCompare(a.published);

export default async function BlogIndex() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const copy = pageCopy(config, "blog", FALLBACK);
  // A draft is a post that exists in the CMS but is not ready to be indexed. It must
  // be filtered here rather than hidden with CSS, or it still reaches the sitemap,
  // the schema and every crawler.
  const posts = (config.blog?.posts ?? [])
    .filter((post) => !post.draft)
    .sort(byNewest);

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, TRAIL),
    {
      "@type": "Blog",
      "@id": `${baseUrl}/blog/#blog`,
      url: `${baseUrl}/blog`,
      name: copy.title,
      description: copy.description,
      author: { "@id": personId(baseUrl) },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: post.published,
        author: { "@id": personId(baseUrl) },
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

      <section className="px-6 pb-4 pt-10 md:pt-14">
        <div className="container mx-auto max-w-6xl">
          <p className="label">
            Articles
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
          <ol className="flex flex-col">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="grid gap-2 border-t border-foreground py-6 md:grid-cols-[140px_1fr] md:gap-10 md:py-8"
              >
                <time
                  dateTime={post.published}
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {post.published}
                </time>
                <div>
                  <h2 className="text-xl md:text-2xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="focus-ring underline underline-offset-4"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 max-w-[62ch] text-[17px] leading-[1.75] text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
