import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon: the same drawn mark as the tab icon, scaled up.
 *
 * Full-bleed and square — iOS applies its own rounded mask, so a radius baked in here
 * would be clipped twice and read as a misaligned inset.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E8EDDF",
      }}
    >
      <svg width="118" height="118" viewBox="0 0 100 100">
        {/* Stroked, not filled. As a filled polygon the M's central notch was only
              26 units deep, and at 16px — a pinned tab — it closed up and the mark
              read as an H. A polyline with its vertex at 62 drives the V most of the
              way to the baseline, so both counters stay open even when the whole
              glyph is four pixels tall. */}
        <path
          d="M 20 80 L 20 24 L 50 62 L 80 24 L 80 80"
          fill="none"
          stroke="#0D0D0C"
          strokeWidth="17"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />
      </svg>
    </div>,
    { ...size },
  );
}
