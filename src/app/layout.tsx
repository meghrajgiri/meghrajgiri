import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navigation } from "@/components/Layout/Navigation";
import { LoadingScreen } from "@/components/Layout/LoadingScreen";
import { SITE_DATA } from "@/config";

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
                <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background" />
                
                {/* Floating orbs */}
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/2 dark:bg-accent/1 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />
                
                {/* Subtle grid pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.02] dark:opacity-[0.016]"
                  style={{
                    backgroundImage: `
                      linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>
              
              {/* Main content */}
              <div className="relative">
                <main className="min-h-screen">
                  {children}
                </main>
                <footer className="border-t border-border/30 dark:border-transparent bg-card/50 backdrop-blur-sm">
                  <div className="container mx-auto px-6 py-8">
                    <div className="text-center text-muted-foreground">
                      <p>&copy; {new Date().getFullYear()} {SITE_DATA.metadata.author}. All rights reserved.</p>
                      <p className="mt-2 text-sm">Built with Next.js, TypeScript, and Tailwind CSS</p>
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