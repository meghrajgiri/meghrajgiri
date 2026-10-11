import { adsenseClient } from "@/lib/adsense";

/**
 * Loads AdSense on `/blog` and `/blog/[slug]` only. The loader is what Auto ads hang
 * off, so scoping it to this layout is what keeps ads off the portfolio pages.
 *
 * A plain `<script async>` rather than `next/script`: React 19 hoists it into <head>
 * and dedupes it, and AdSense logs a warning about the `data-nscript` attribute that
 * `next/script` adds.
 */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {adsenseClient && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      )}
      {children}
    </>
  );
}
