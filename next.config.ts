import type { NextConfig } from "next";

/** Hostname of the Supabase project serving `project-images`, e.g. `abc.supabase.co`. */
const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
    /**
     * Project screenshots live in Supabase Storage, so the optimiser has to be told
     * the host is allowed — `next/image` refuses unlisted remote hosts rather than
     * proxying anything a URL points at.
     *
     * Derived from the same env var the client uses instead of hardcoding the project
     * ref, so pointing the site at a different Supabase project does not silently
     * break every image.
     */
    remotePatterns: SUPABASE_HOST
      ? [
          {
            protocol: "https" as const,
            hostname: SUPABASE_HOST,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // AVIF first, WebP second. The project screenshots are the heaviest assets on the
    // site — several are over a megabyte as PNG — and these formats typically cut that
    // by 60-80% at the sizes they are actually displayed.
    formats: ["image/avif", "image/webp"],
    // Cache derivatives for a year. The sources are content-addressed by path and only
    // change when a project is re-uploaded, so re-deriving them hourly is waste.
    minimumCacheTTL: 31536000,
  },
  // Renamed from `experimental.serverComponentsExternalPackages` in Next 15; the old
  // key is ignored, which silently dropped this package from the external list.
  serverExternalPackages: ["@react-email/render"],

  // Names the framework and its version to anyone who asks for a header, which is a
  // free hint for anyone scanning for known Next.js issues. Nothing depends on it.
  poweredByHeader: false,

  /**
   * Response headers.
   *
   * Deliberately not a Content-Security-Policy. A CSP is the header that actually
   * stops script injection, but this site loads Vercel Analytics, Speed Insights and
   * Iconify at runtime, and a policy written without testing each of those breaks the
   * page silently in production. The headers below are the subset that cannot break a
   * working page — worth setting now, with CSP left as its own piece of work.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops a browser from second-guessing a declared Content-Type, which is how
          // an uploaded file gets treated as a script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No framing at all: nothing here is meant to be embedded, and clickjacking
          // a contact form is the plausible attack.
          { key: "X-Frame-Options", value: "DENY" },
          // Send the full URL within this origin, only the origin to other sites, and
          // nothing at all when downgrading to http.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // The site asks for none of these, so denying them costs nothing and removes
          // them from any embedded content's reach.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // A deliberately partial CSP. `script-src` is absent, and that is the
          // decision worth explaining: Next.js emits inline bootstrap scripts and this
          // site emits inline JSON-LD, so a script policy needs either
          // `'unsafe-inline'` — which buys close to nothing — or per-request nonces,
          // which force every page out of static prerendering and into dynamic
          // rendering. Trading the site's TTFB for a policy that still allows inline
          // script is a bad deal.
          //
          // What remains are the directives that cost nothing and still close real
          // holes: `base-uri` stops an injected <base> tag redirecting every relative
          // URL on the page, `form-action` stops the contact form being repointed at
          // someone else's server, `object-src` kills legacy plugin embeds, and
          // `frame-ancestors` is the modern spelling of the X-Frame-Options above.
          {
            key: "Content-Security-Policy",
            value: [
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
