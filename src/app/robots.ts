import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/cms` is deliberately NOT disallowed, which reads backwards until you follow
        // it through. It renders `noindex, nofollow`, and a Disallow prevents Googlebot
        // from ever fetching the page to see that — so the two controls cancel out, and
        // a URL discovered any other way could still be listed bare, with no snippet.
        // Letting the crawl through is what makes the noindex actually de-index it. The
        // page is behind authentication either way, so nothing is exposed by the fetch.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.meghrajgiri.com/sitemap.xml",
  };
}
