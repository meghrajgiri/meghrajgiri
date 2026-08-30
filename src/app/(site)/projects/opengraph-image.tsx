import { getAllConfig } from "@/lib/config";
import { ImageResponse } from "next/og";

export const alt = "Selected work — Meghraj Giri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card for the work index.
 *
 * This route needs its own: `generateMetadata` here declares an `openGraph` block
 * without `images`, which stops the root-level card being inherited — the page shipped
 * with `twitter:card: summary_large_image` and no image at all.
 */
export default async function Image() {
  const config = await getAllConfig();
  const projects = config.projects?.projects?.filter((p) => p.published !== false) ?? [];
  const host = (config.metadata?.url ?? "https://www.meghrajgiri.com").replace(
    /^https?:\/\//,
    "",
  );
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a8a8a",
            }}
          >
            Selected work
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {projects.length} products,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: "#8a8a8a",
              letterSpacing: -3,
              lineHeight: 1.05,
              marginTop: -18,
            }}
          >
            {categories.length} industries
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 820 }}>
            {categories.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: "#d8d8d8",
                  border: "1px solid #333333",
                  borderRadius: 8,
                  padding: "10px 20px",
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#8a8a8a" }}>{host}</div>
        </div>
      </div>
    ),
    size,
  );
}
