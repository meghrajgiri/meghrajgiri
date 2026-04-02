import { Navigation } from "@/components/Layout/Navigation";
import { SiteConfigProvider } from "@/components/providers/SiteConfigProvider";
import { getAllConfig } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

  return (
    <SiteConfigProvider config={config}>
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
            <footer className="border-border/30 bg-card/50 border-t backdrop-blur-sm dark:border-transparent">
              <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p>
                    &copy; {new Date().getFullYear()}{" "}
                    {config.metadata.author}. All rights reserved.
                  </p>
                  <Link
                    href="/admin"
                    className="text-muted-foreground/50 text-xs transition-colors hover:text-muted-foreground"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
    </SiteConfigProvider>
  );
}
