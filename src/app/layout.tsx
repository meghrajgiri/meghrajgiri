import { LoadingScreen } from "@/components/Layout/LoadingScreen";
import { Navigation } from "@/components/Layout/Navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SITE_DATA } from "@/config";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_DATA.metadata.title,
  description: SITE_DATA.metadata.description,
  keywords: SITE_DATA.metadata.keywords,
  authors: [{ name: SITE_DATA.metadata.author }],
  creator: SITE_DATA.metadata.author,
  openGraph: {
    type: SITE_DATA.metadata.type as "website",
    locale: SITE_DATA.metadata.locale,
    url: SITE_DATA.metadata.url,
    title: SITE_DATA.metadata.title,
    description: SITE_DATA.metadata.description,
    siteName: SITE_DATA.metadata.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DATA.metadata.title,
    description: SITE_DATA.metadata.description,
    creator: SITE_DATA.metadata.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <LoadingScreen>
            <div className="relative min-h-screen bg-background">
              {/* Enhanced background effects */}
              <div className="fixed inset-0 -z-10">
                {/* Animated gradient mesh */}
                <div className="via-muted/5 absolute inset-0 bg-gradient-to-br from-background to-background" />

                {/* Floating orbs */}
                <div
                  className="bg-accent/2 dark:bg-accent/1 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse-subtle rounded-full blur-3xl"
                  style={{ animationDelay: "1s" }}
                />

                {/* Subtle grid pattern */}
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

              {/* Main content */}
              <div className="relative">
                <main className="min-h-screen">{children}</main>
                <footer className="border-border/30 bg-card/50 border-t backdrop-blur-sm dark:border-transparent">
                  <div className="container mx-auto px-6 py-8">
                    <div className="text-center text-muted-foreground">
                      <p>
                        &copy; {new Date().getFullYear()}{" "}
                        {SITE_DATA.metadata.author}. All rights reserved.
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </LoadingScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
