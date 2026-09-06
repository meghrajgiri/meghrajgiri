import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser tab icon, generated from the palette rather than shipped as a bitmap.
 *
 * The previous `icon.png` was a glossy skeuomorphic tile — bevelled edge, specular
 * highlight, blue-black gradient — which belongs to a different decade and a
 * different site. Nothing else here has a gradient or a shadow.
 *
 * Drawn as geometry, not type. The obvious version of this sets "MG" in a bold face,
 * but `ImageResponse` renders through Satori, whose default sans has no bold cut — so
 * `fontWeight: 800` silently rendered at regular weight, and two hairline letters at
 * 16px blurred into a smudge. Bundling a real font to fix that would add a binary and
 * a load step for one glyph. A stroked path has no weight to lose, needs no font, and
 * stays crisp at any size.
 *
 * One letter rather than the header's two: at 16px — a pinned tab, a crowded tab bar —
 * two glyphs get about seven pixels each, which is below the size at which either is
 * readable. The tile, the palette and the mark's proportions still match the header
 * monogram, which is what carries the recognition.
 *
 * Cream tile rather than a dark one on purpose. A near-black favicon vanishes against
 * dark browser chrome, which is exactly where this site's visitors are likely to be;
 * the light tile holds its shape on either.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E8EDDF",
        borderRadius: 7,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 100 100">
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
