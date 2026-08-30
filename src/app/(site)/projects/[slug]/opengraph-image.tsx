import { getAllConfig } from "@/lib/config";
import { ImageResponse } from "next/og";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Per-project social preview card.
 *
 * Project pages previously pointed `og:image` at `project.image` — a screenshot with
 * an arbitrary aspect ratio, which social platforms crop unpredictably. A purpose-made
 * 1200x630 card keeps the title readable at the size it is actually rendered.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getAllConfig();
  const project = config.projects?.projects?.find((p) => p.slug === slug);
  const host = (config.metadata?.url ?? "https://www.meghrajgiri.com").replace(
    /^https?:\/\//,
    "",
  );

  const title = project?.title ?? "Project";
  const category = project?.category ?? "";
  const year = project?.year ?? "";
  const tech = project?.technologies?.slice(0, 5) ?? [];

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
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {category ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "#0a0a0a",
                  background: "#ffffff",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontWeight: 600,
                }}
              >
                {category}
              </div>
            ) : null}
            <div style={{ display: "flex", fontSize: 22, color: "#8a8a8a" }}>
              {year}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 62 : 78,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 780 }}>
            {tech.map((t: string) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "#d8d8d8",
                  border: "1px solid #333333",
                  borderRadius: 8,
                  padding: "8px 16px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#8a8a8a" }}>
            {host}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
