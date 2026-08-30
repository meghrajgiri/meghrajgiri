import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
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
};

export default nextConfig;
