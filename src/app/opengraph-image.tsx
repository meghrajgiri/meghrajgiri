import { getAllConfig } from "@/lib/config";
import { ImageResponse } from "next/og";

export const alt = "Meghraj Giri — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social preview card.
 *
 * The site declares `twitter:card: summary_large_image` but shipped without any image
 * for it to show, so every share — LinkedIn, Slack, X — rendered as a bare text link.
 *
 * Monochrome on purpose: the site's own palette (globals.css) is black, white and
 * grey, and a coloured card would misrepresent it at the moment someone forms a first
 * impression.
 */
export default async function Image() {
  const config = await getAllConfig();
  const name = config.personal?.name ?? "Meghraj Giri";
  const role = config.personal?.role ?? "Full Stack Developer";
  const host = (config.metadata?.url ?? "https://www.meghrajgiri.com").replace(
    /^https?:\/\//,
    "",
  );
  const skills = config.hero?.floatingSkills?.slice(0, 5) ?? [];

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
            {host}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              color: "#c4c4c4",
              letterSpacing: -0.5,
            }}
          >
            {role}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {skills.map((skill: string) => (
            <div
              key={skill}
              style={{
                display: "flex",
                fontSize: 24,
                color: "#d8d8d8",
                border: "1px solid #333333",
                borderRadius: 8,
                padding: "10px 20px",
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
