import { Navigation } from "@/components/Layout/Navigation";
import { SiteFooter } from "@/components/Layout/SiteFooter";
import { SiteConfigProvider } from "@/components/providers/SiteConfigProvider";
import { getAllConfig } from "@/lib/config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  const meta = config.metadata;

  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: meta.author }],
    creator: meta.author,
    openGraph: {
      type: meta.type as "website",
      locale: meta.locale,
      url: meta.url,
      title: meta.title,
      description: meta.description,
      siteName: meta.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: meta.twitter,
    },
    alternates: {
      canonical: meta.url,
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getAllConfig();

  // `SiteConfigProvider` is a client component, so whatever it is handed is serialised
  // into the RSC payload of every page under this layout. `pages`, `hire` and `blog`
  // are read only by server components — and `blog` carries the full Markdown of every
  // article, so passing the whole object shipped all three posts on every route,
  // roughly 28KB of HTML that nothing on the page could use.
  const clientConfig = { ...config };
  delete clientConfig.pages;
  delete clientConfig.hire;
  delete clientConfig.blog;

  // `published: false` decides what *renders*. It does not decide what travels: the
  // whole projects array was reaching the client, so an unpublished draft — client
  // name, case study and all — sat in the HTML source of every page, invisible to a
  // reader and perfectly readable to anyone who viewed source or crawled it. Drafts
  // are exactly the thing that must not leak, so they are removed here rather than
  // merely skipped at render time.
  if (clientConfig.projects?.projects) {
    clientConfig.projects = {
      ...clientConfig.projects,
      projects: clientConfig.projects.projects.filter((p) => p.published !== false),
    };
  }

  return (
    <SiteConfigProvider config={clientConfig}>
      <Navigation />
      {/* The ambient background is gone, and its absence is the design.
          
          It was three stacked layers: a gradient that resolved to background-to-
          background, a blurred circle running `animate-pulse-subtle` forever, and a
          grid overlay at 2% opacity. On an OLED ground every one of those is lit
          pixels over what is meant to be an unlit field, and the pulse in particular
          was an unguarded infinite animation that ignored `prefers-reduced-motion`.
          Flat black is both the cheaper render and the actual style. */}
      <div className="relative min-h-screen bg-background">
        <main>{children}</main>
        <SiteFooter config={config} />
      </div>
    </SiteConfigProvider>
  );
}
