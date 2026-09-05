import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Satoshi and Cabinet Grotesk, both from Indian Type Foundry via Fontshare and free
 * for commercial use. Self-hosted variable files rather than the Fontshare CDN: one
 * fewer connection to set up, and `next/font/local` inlines the @font-face and
 * preloads it, so there is no flash of fallback text.
 */
const body = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "../../public/fonts/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const display = localFont({
  src: "../../public/fonts/CabinetGrotesk-Variable.woff2",
  weight: "300 800",
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meghrajgiri.com"),
  // Only a fallback: every public route is inside `(site)`, whose layout generates
  // metadata from the CMS. This is what /cms and anything outside that group inherits,
  // and it was left describing the site as it read a year ago.
  title: "Meghraj Giri — Full Stack Developer in Nepal",
  description:
    "Full stack and frontend developer in Butwal, Nepal, building web and mobile products with React, Next.js and React Native.",
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
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      {/* Grammarly and similar extensions write attributes onto <body>
          (`data-gr-ext-installed`, `data-new-gr-c-s-loaded`) before React hydrates,
          which React reports as a hydration mismatch on every page load for anyone who
          has one installed. `suppressHydrationWarning` applies one level deep only —
          it silences attribute differences on this element and nothing below it, so a
          real mismatch inside the app is still reported. The <html> element already
          carries it for the same reason, via next-themes. */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // `enableSystem` is off deliberately. With it on, a visitor whose OS is set
          // to light lands on the light theme regardless of the default — so "default
          // dark" would only apply to people already in dark mode. The toggle still
          // works and the choice is still remembered.
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
