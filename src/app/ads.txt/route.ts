import { adsenseClient } from "@/lib/adsense";

// Built once at deploy time from the env var; it only changes with the publisher ID.
export const dynamic = "force-static";

/**
 * `/ads.txt`, the list of sellers authorised to sell this domain's inventory. Without
 * it AdSense flags the site and advertisers bid less on it. The entry uses the
 * `pub-` form of the ID, without the `ca-` prefix. `f08c47fec0942fa0` is Google's
 * fixed certification-authority ID.
 */
export function GET() {
  if (!adsenseClient) return new Response("Not found", { status: 404 });

  const publisher = adsenseClient.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
