import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { Markdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const config = await getAllConfig();
  return (config.blog?.posts ?? [])
    .filter((post) => !post.draft)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getAllConfig();
  const post = config.blog?.posts?.find((p) => p.slug === slug && !p.draft);
  if (!post) return {};

  return pageMetadata(config, {
    path: `/blog/${post.slug}`,
    title: post.metaTitle,
    description: post.description,
    keywords: post.keywords,
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getAllConfig();
  const post = config.blog?.posts?.find((p) => p.slug === slug && !p.draft);
  if (!post) notFound();

  const baseUrl = config.metadata.url;

  const trail = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, trail),
    {
      "@type": "BlogPosting",
      "@id": `${baseUrl}/blog/${post.slug}/#post`,
      url: `${baseUrl}/blog/${post.slug}`,
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      ...(post.updated && { dateModified: post.updated }),
      inLanguage: "en",
      // Both, deliberately. `author` is the citable claim — an AI answer attributing
      // this article needs a person to attribute it to, and that person is the same
      // `@id` every other page on this site points at.
      author: { "@id": personId(baseUrl) },
      publisher: { "@id": personId(baseUrl) },
      mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs trail={trail} />

      <article className="px-6 pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="container mx-auto max-w-6xl">
          <header className="max-w-[68ch]">
            <time
              dateTime={post.published}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {post.published}
            </time>
            <h1 className="mt-4 max-w-[24ch] text-[2rem] md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          </header>

          {/* The prose column is held to a readable measure; `Markdown` is the same
              server-side renderer the case studies use, so nothing here ships a parser
              to the client. */}
          <div className="prose-measure mt-12 max-w-[68ch] md:mt-16">
            <Markdown source={post.body} />
          </div>

          <footer className="mt-14 max-w-[68ch] border-t border-border pt-8">
            <p className="text-[17px] leading-[1.75] text-muted-foreground">
              Written by Meghraj Giri, a full stack developer in Butwal, Nepal.{" "}
              <Link
                href="/about"
                className="focus-ring underline underline-offset-4 hover:text-foreground"
              >
                More about him
              </Link>
              , or{" "}
              <Link
                href="/blog"
                className="focus-ring underline underline-offset-4 hover:text-foreground"
              >
                read the other articles
              </Link>
              .
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}
