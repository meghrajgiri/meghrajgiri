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
      <div className="relative min-h-screen bg-background">
          {/* Background effects */}
          <div className="fixed inset-0 -z-10">
            <div className="via-muted/5 absolute inset-0 bg-gradient-to-br from-background to-background" />
            <div
              className="bg-accent/2 dark:bg-accent/1 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse-subtle rounded-full blur-3xl"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.016]"
              style={{
                backgroundImage: `
                  linear-gradient(var(--border) 1px, transparent 1px),
                  linear-gradient(90deg, var(--border) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative">
            <main className="min-h-screen">{children}</main>
            <SiteFooter config={config} />
          </div>
        </div>
    </SiteConfigProvider>
  );
}
